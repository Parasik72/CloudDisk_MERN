const {User} = require('../models');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const createJWT = (user, secretKey, expiresInTime) => {
    return jwt.sign({
        id: user._id
    },
    secretKey,
    {
        expiresIn: expiresInTime
    });
}

class Controller {
    // /api/auth/registration 'POST'
    async registration(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())             
                return res.status(400).json({message: errors.errors[0].msg});
            const {email, password} = req.body;
            const candidate = await User.findOne({email});
            if(candidate)
                return res.status(400).json({message: 'Email is already in use.'});
            const hashPassword = await bcrypt.hash(password, 8);
            const user = await User.create({
                email,
                password: hashPassword
            });
            const token = createJWT(user, config.get('jwtSecret'), '1h');
            return res.json({
                message: 'User was created!', 
                token,
                user: {
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                    username: user.username
                }
            });
        } catch (error) {
            return res.status(500).json({message: 'Registration error.'});
        }
    }

    // /api/auth/login 'POST'
    async login(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())             
                return res.status(400).json({message: errors.errors[0].msg});
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user)
                return res.status(400).json({message: "Incorrect data"});
            const bCheckPassword = await bcrypt.compare(password, user.password);
            if(!bCheckPassword)
                return res.status(400).json({message: "Incorrect data"});
            const token = createJWT(user, config.get('jwtSecret'), '1h');
            return res.json({
                token, 
                user: {
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                    username: user.username
                }
            });
        } catch (error) {
            return res.status(500).json({message: 'Login error.'});
        }
    }

    // /api/auth/ 'GET'
    async auth(req, res){
        try {
            const user = await User.findById(req.user.id);
            if(!user)
                return res.status(400).json({message: "Incorrect data"});
            const token = createJWT(user, config.get('jwtSecret'), '1h');
            return res.json({
                token,
                user: {
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                    username: user.username
                }
            });
        } catch (error) {
            return res.status(500).json({message: 'Auth error.'});
        }
    }
}

module.exports = new Controller();