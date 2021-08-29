const mongoose = require('mongoose');

const schema = mongoose.Schema({
   name: {
       type: String,
       required: true
   }, 
   type: {
       type: String,
       required: true
   },
   parent: {
       type: mongoose.Types.ObjectId,
       ref: 'File'
   },
   size: {
       type: Number,
       default: 0
   },
   owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
   },
   path: {
        type: String,
        default: ''
   },
   date: {
       type: Date,
       default: Date.now()
   }
});

module.exports = mongoose.model('File', schema);