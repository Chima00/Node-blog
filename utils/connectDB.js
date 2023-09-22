require('dotenv').config()
const mongoose = require('mongoose');
console.log(process.env.DB)
// const dblink = 'mongodb+srv://CLever:8HI89zS22z432hLt@cluster0.fkilvng.mongodb.net/test'

async function connectDB(){
    try{
        console.log('connecting to db')
      await  mongoose.connect((process.env.DB),{
            useNewUrlparser:true,
            useUnifiedTopology:true,
        })
    // mongoose.connect('mongodb://127.0.0.1:27017/db')
        console.log('connected')
    }catch(error){
        console.log(error)
    }
}

module.exports=connectDB