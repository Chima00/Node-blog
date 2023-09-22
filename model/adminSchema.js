const mongoose = require('mongoose')
const {Schema} = mongoose;


// first way to write a schema
const Admin = new Schema({
    username:String,
    password:String,
    role:String,
    active:Boolean,
    trim:Boolean
})

module.exports = mongoose.model('Admins',Admin)