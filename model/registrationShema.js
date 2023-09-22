const mongoose = require('mongoose')
const {Schema} = mongoose;


// first way to write a schema
// const users = new Schema({
//     username:String,
//     password:String,
//     role:String,
//     active:Boolean,
//     trim:Boolean
// })

// Schema with a validation
// const users = new Schema({
//     username:{
//         type:String,
//         require:true,
//         minLength:[10,'Username must be above 10'],
//         unique:true
//     },
//     password:{
//         type:String,
//         require:true,
//         minLength:[7,'password must be above 7'],
//     },
//     role:{
//         type:String,
//         require:true,
//     },
//     active:{
//         type:Boolean,
//         require:true
//     }
// })
// Schema with a validation
const users = new Schema({
    username:{
        type:String,
        require:true,
        minLength:[10,'Username must be above 10'],
        unique:true
    },
    password:{
        type:String,
        require:true,
        minLength:[7,'password must be above 7'],
    },
    fullname:{
        type:String,
        require:true,
        minLength:[7,'password must be above 7'],
    },
    passport:{
        type:String,
        require:true,
        minLength:[7,'password must be above 7'],
    },
    phone:{
        type:String,
        require:true,
        minLength:[7,'password must be above 7'],
    },
    role:{
        type:String,
        require:true,
    },
    active:{
        type:Boolean,
        require:true
    }
})

module.exports = mongoose.model('User',users)