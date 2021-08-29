const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    diskSpace: {
        type: Number,
        default: 1024**3*15
    },
    usedSpace: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String
    },
    username: {
        type: String
    }
});

module.exports = mongoose.model('User', schema);