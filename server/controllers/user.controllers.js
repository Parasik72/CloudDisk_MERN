const {User, File} = require('../models');
const fs = require('fs');
const path = require('path');
const config = require('config');
const {validationResult} = require('express-validator');

class Controller {
    // /api/user/avatar 'POST'
    async avatar(req, res){
        try {
            const {file} = req.files;
            if(!file)
                return res.status(400).json({message: 'File error.'})
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            let filePath = path.join(config.get('staticPath'), user._id.toString());
            if(fs.existsSync(filePath)){
                fs.readdirSync(filePath).forEach(fileItem => {
                    fs.unlinkSync(path.join(filePath, fileItem));
                });
            }
            fs.mkdirSync(filePath, {recursive: true}, e => e && console.log(e));
            filePath = path.join(filePath, file.name);
            file.mv(filePath);
            user.avatar = path.join(user._id.toString(), file.name);
            await user.save();
            return res.json({avatar: user.avatar});
        } catch (error) {
            return res.status(500).json({message: 'Avatar error.'});
        }
    }

    // /api/user/clean 'DELETE'
    async clean(req, res){
        try {
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            const files = await File.find({owner: user._id});
            files?.forEach(async file => {
                if(file.type !== 'dir')
                    if(fs.existsSync(path.join(file.path, file.name)))
                        fs.unlinkSync(path.join(file.path, file.name));
                await file.remove();
            });
            fs.rmdirSync(path.join(config.get('filesPath'), user._id.toString()), {recursive: true}, e => e && console.log(e));
            user.usedSpace = 0;
            await user.save();
            return res.json({message: 'Disk has been cleaned up!', user});
        } catch (error) {
            return res.status(500).json({message: 'Clear error.'});
        }
    }

    // /api/user/username 'POST'
    async username(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())             
                return res.status(400).json({message: errors.errors[0].msg});
            const {username} = req.body;
            if(!username)
                return res.status(400).json({message: 'Incorrect username.'});
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            user.username = username;
            await user.save();
            return res.json({message: 'Username has been changed!'});
        } catch (error) {
            return res.status(500).json({message: 'Username error.'});
        }
    }

    // /api/user/email 'POST'
    async email(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())             
                return res.status(400).json({message: errors.errors[0].msg});
            const {email} = req.body;
            if(!email)
                return res.status(400).json({message: 'Incorrect email.'});
            const checkEmail = await User.findOne({email});
            if(checkEmail)
                return res.status(400).json({message: 'Email is already in use.'});
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(401).json({message: 'No authorization.'});
            user.email = email;
            await user.save();
            return res.json({message: 'Email has been changed!'});
        } catch (error) {
            return res.status(500).json({message: 'Email error.'});
        }
    }
}

module.exports = new Controller();