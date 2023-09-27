const express = require('express')
const path = require('path')

const session = require('express-session')
// const mongoDBSession = require ("connect-mongodb-session")(session)
const mongoDBSession = require ("connect-mongodb-session")(session)
const flash = require ('connect-flash')

const connectDB = require('./utils/connectDB')
const User = require('./model/registrationShema')
const Admins = require('./model/adminSchema')

const bcrypt = require('bcrypt');
const app = express();


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/Public')))


//creating mongodb session
const store = new mongoDBSession({
    uri:'mongodb+srv://CLever:8HI89zS22z432hLt@cluster0.fkilvng.mongodb.net/test',
    collection:"mySession"

})

//setup flash with session
app.use(session({
    secret:'keyboard cat',
    saveUninitialized:false,
    resave:false,
    store:store

    })) 
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB()
const port = 3000;

const Authentication = (req,res,next) =>{

    if (req.session.Authentication){
        next()
    }else{
        res.redirect("/login")
    }

};

// const isAuth = (req,res,next)=>{
//     if(req.session.isAuth){
//         next();
//     }else{
//         res.redirect("/login")
//     }
// };
app.get('/', (req,res)=>{
    console.log(req.sessionID)
    res.render('registration', {messages:req.flash('info')})
})

app.get('/weather', (req,res)=>{
    res.render('weather')
})

app.get('/login', (req,res)=>{
    res.render('login', {messages:req.flash('info')})
})
app.get("/forgetpassword",async (req,res)=>{
    res.render("forgetpassword",{messages:req.flash('info')})
})
app.get('/dashboard', Authentication, (req,res)=>{
    // console.log(foundUser)
    res.render('dashboard',{foundUser})
})
app.get('/admindashboard',async (req,res)=>{

    const allUsers = await User.find()
    console.log(allUsers)
res.render('admindashboard', {allUsers})
})

app.get('/adminRegistration', (req,res)=>{
    res.render("adminReg")
})
// all this is collecting data from the frontend
app.post('/registration',async (req,res)=>{
    
    try {
        const {username,fullname,passport,phone,password}=req.body
        console.log({username,password})
        const foundUser = await User.findOne({username:username})
        if(foundUser){
            req.flash('info', 'User Already Exist')
            res.redirect('/')
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        const user = new User({
            username:username,
            fullname:fullname,
            password: hashedpassword,
            phone:phone,
            passport:passport,
            role:'User',
            active:true,
            trim:true
        })
        await user.save() 
        res.redirect('/login')
    } catch (error) {
        console.log(error)
    }

})

//admin route
app.post('/adminRegistration',async (req,res)=>{
    
    try {
        const {username,password}=req.body
        console.log({username,password})
        const foundUser = await User.findOne({username:username})
        if(foundUser){
            req.flash('info', 'User Already Exist')
            res.redirect('/adminRegistration')
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        const user = new Admins({
            username:username,
            password: hashedpassword,
            role:'Admins',
            active:true,
            trim:true
        })
        await user.save() 
        res.redirect('/login')
    } catch (error) {
        console.log(error)
    }

})



let foundUser 

app.post('/login',async (req,res)=>{
const {username , password} = req.body
// console.log({username,password})

foundUser = await User.findOne({username:username})

if(foundUser){
    const user = await bcrypt.compare(password, foundUser.password)

    if(user){
        // req.session.isAuth = true;
        req.session.Authentication = true;
        res.redirect('/dashboard')
    }else{
        req.flash('info','username or password is Incorrect')
        res.redirect('/login')
    }
}else{
    const foundAdmin = await Admins.findOne({username:username})
    if (foundAdmin){
        const user = await bcrypt.compare(password,foundAdmin.password)
        if(user){
            res.redirect('/admindashboard')
        }else{
            req.flash('username or password is Incorrect')
            res.redirect('/login')
        }
    }
}

})

app.post('/forgetpassword',async (req,res)=>{
    const{username,newpassword}=req.body
    console.log({username,newpassword})

    if(username.length < 10 || newpassword.length <7){
        req.flash('info', 'username must be greater than 10 and passwordmust be greater than 7!')
        res.redirect('/forgetpassword')
    }else{
        const hashedPassword = await bcrypt.hash(newpassword,10)
        const user = await User.findOneAndUpdate({username:username},{$set: {password:hashedPassword}})
        req.flash('info', 'password has been successfully updated!')
        res.redirect('/login')
    }
})

//deleting user by the admin
app.get("/delete/:id", async (req,res)=>{
    const {id}= req.params
    console.log(id)
    await User.findByIdAndDelete({_id:id})
    res.redirect("/admindashboard")
})


app.post("/logout", (req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/login")
    })
})

// app.post("/logout", (req,res) =>{
//     req.session.destroy((err)=>{
//         if (err) throw err;
//         res.redirect('/')
//     })
// })



app.listen(port,()=>{
    console.log(`server is currently running on port ${port} `)
})