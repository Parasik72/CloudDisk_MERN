const fs = require('fs');
const {File, User} = require('../models');
const config = require('config');
const path = require('path');

const recursiveSizeSave = async (size, parent = null) => {
    try {
        if(parent !== null){
            const file = await File.findById(parent);
            if(!file)
                return;
            file.size += size;
            await file.save();
            recursiveSizeSave(size, file?.parent);
        }
    } catch (error) {
        console.log(error);
    }
}

const recursiveDir = (dir, name) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPathDir = path.join(dir, file);
        const fullPathName = path.join(name, file);
        if(fs.lstatSync(fullPathDir).isDirectory()){
            fs.mkdirSync(fullPathName, {recursive: true}, e => console.log(e));
            recursiveDir(fullPathDir, fullPathName);
        }else
            fs.renameSync(fullPathDir, fullPathName);
    });
}

const transferToNewDir = async (file, name, user) => {
    fs.mkdirSync(file.path + "\\" + name, {recursive: true}, e => console.log(e));
    recursiveDir(file.path + '\\' + file.name, file.path + '\\' + name);
    fs.rmdirSync(file.path + "\\" + file.name, {recursive: true});
    const childFiles = await File.find({owner: user._id});
    childFiles?.forEach(async childFile => {
        if(childFile.path.includes(file.path + '\\' + file.name)){
            const endPart = childFile.path.substring((file.path + '\\' + file.name).length + 1);
            let newPath = file.path + '\\' + name;
            if(endPart.length)
                newPath += "\\" + endPart;
            childFile.path = newPath;
            await childFile.save();
        }
    });
    file.name = name;
    await file.save();
}

class Controller {
    // /api/file/ 'POST'
    async createDir(req, res){
        try {
            const {name, type, parent} = req.body;
            const fileCheck = await File.findOne({
                owner: req.user.id, 
                name,
                type,
                parent
            });
            if(fileCheck)
                return res.status(400).json({message: 'File is alredy exists.'});
            const file = await File.create({
                owner: req.user.id, 
                name,
                type,
                parent
            });
            const parentFile = await File.findOne({owner: req.user.id, _id: parent});
            if(parentFile)
                file.path = parentFile.path + '\\' + parentFile.name;
            else
                file.path = config.get('filesPath') + "\\" + file.owner;
            if(fs.existsSync(file.path + "\\" + file.name)){
                await file.remove();
                return res.status(400).json({message: 'File is alredy exists.'});
            }
            fs.mkdirSync(file.path + "\\" + file.name, {recursive: true}, e => e && console.log(e));
            await file.save();
            return res.json({file});
        } catch (error) {
            return res.status(500).json({message: 'Create dir error.'});
        }
    }

    // /api/file/ 'GET'
    async getFiles(req, res){
        try {
            const {dirId, sort, direction} = req.query;
            const files = await File.find({owner: req.user.id, parent: dirId})
                .sort({[sort]: direction});
            let resFiles = [];
            files?.filter(file => {
                if(file.type === 'dir')
                    resFiles.push(file);
            });
            files?.filter(file => {
                if(file.type !== 'dir')
                    resFiles.push(file);
            });
            return res.json({files: resFiles});
        } catch (error) {
            return res.status(500).json({message: 'Get files error.'});
        }
    }

    // /api/file/upload 'POST'
    async upload(req, res){
        try {
            const {dirId} = req.body;
            const {file} = req.files;
            const type = file.name.split('.').pop();
            const checkFile = await File.findOne({
                owner: req.user.id,
                name: file.name,
                parent: dirId,
                type
            });
            if(checkFile)
                return res.status(400).json({message: 'File is alredy exists.'});
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            if(user.usedSpace + file.size > user.diskSpace)
                return res.status(400).json({message: 'Not enough disk space.'})
            const parent = await File.findOne({owner: user._id, _id: dirId});
            let filePath;
            if(parent)
                filePath = parent.path + "\\" + parent.name;
            else{
                filePath = config.get('filesPath') + '\\' + user._id;
                if(!fs.existsSync(filePath))
                    fs.mkdirSync(filePath, {recursive: true}, e => e && console.log(e));
            }
            if(fs.existsSync(filePath + '\\' + file.name))
                return res.status(400).json({message: 'File is alredy exists.'});
            file.mv(filePath + '\\' + file.name);
            const fileDB = await File.create({
                owner: req.user.id,
                name: file.name,
                parent: dirId,
                type,
                path: filePath,
                size: file.size
            });
            user.usedSpace += file.size;
            await user.save();
            await fileDB.save();
            recursiveSizeSave(file.size, parent);
            return res.json({file: fileDB, user});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Upload error.'});
        }
    }

    // /api/file/ 'DELETE'
    async delete(req, res){
        try {
            const {id} = req.query;
            if(!id)
                return res.status(400).json({message: 'File was not found.'});
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            const file = await File.findOne({_id: id, owner: user._id});
            if(!file)
                return res.status(400).json({message: 'File was not found.'});
            if(!fs.existsSync(file.path + "\\" + file.name))
                return res.status(400).json({message: 'File was not found.'});
            if(file.type === 'dir')
                fs.rmdirSync(file.path + "\\" + file.name);
            else
                fs.unlinkSync(file.path + "\\" + file.name);
            user.usedSpace -= file.size;
            await user.save();
            recursiveSizeSave(-file.size, file?.parent);
            await file.remove();
            return res.json({message: 'File was deleted!', user});
        } catch (error) {
            return res.status(500).json({message: 'Folder is not empty.'});
        }
    }

    // /api/file/download 'GET'
    async download(req, res){
        try {
            const {id} = req.query;
            if(!id)
                return res.status(400).json({message: 'File was not found.'});
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            const file = await File.findOne({_id: id, owner: user._id});
            if(!file)
                return res.status(400).json({message: 'File was not found.'});
            if(!fs.existsSync(file.path + "\\" + file.name))
                return res.status(400).json({message: 'File was not found.'});
            return res.download(file.path + "\\" + file.name, file.name);
        } catch (error) {
            return res.status(500).json({message: 'Download error.'});
        }
    }

    // /api/file/ 'PATCH'
    async rename(req, res){
        try {
            const {id} = req.query;
            const {name} = req.body;
            if(!id)
                return res.status(400).json({message: 'File was not found.'});
            if(!name)
                return res.status(400).json({message: 'Incorrect name'});
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            const file = await File.findOne({_id: id, owner: user._id});
            if(!file)
                return res.status(400).json({message: 'File was not found.'});
            if(!fs.existsSync(file.path + '\\' + file.name))
                return res.status(400).json({message: 'File was not found.'});
            if(fs.existsSync(file.path + '\\' + name))
                return res.status(400).json({message: 'This name is already exists.'});
            await transferToNewDir(file, name, user);
            return res.json({file});
        } catch (error) {
            return res.status(500).json({message: 'Rename error.'});
        }
    }

    // /api/file/search 'GET'
    async search(req, res){
        try {
            const {name, dirId} = req.query;
            if(!name)
                return res.status(400).json({message: 'Incorrect name.'});
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            let files = await File.find({owner: user._id});
            if(dirId){
                const parent = await File.findOne({_id: dirId, owner: user._id});
                files = files?.filter(file => file.name.toLowerCase().includes(name.toLowerCase()) && file.path.includes(path.join(parent.path, parent.name)));
            }
            else
                files = files?.filter(file => file.name.toLowerCase().includes(name.toLowerCase()));
            return res.json({files});
        } catch (error) {
            return res.status(500).json({message: 'Search error.'});
        }
    }
}

module.exports = new Controller();