const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const User = require('./models/user');

//Database Connection
mongoose.connect('mongodb://localhost:27017/kanban',{
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const app  = express();

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    res.send('Hello from server');
})

app.get('/login',(req,res)=>{
    res.render('user/login');
})
app.post('/login',(req,res)=>{
    
    res.send(req.body);
})

app.get('/register',(req,res)=>{
    res.render('user/register');
})
app.post('/register',async(req,res)=>{
    const { email , username , password} = req.body;
    const user = new User({email : email,name : username,password : password});
    user.email = email;
    user.name = username;
    user.password = password;
    const result = await user.save();
    // console.log(result);
    res.redirect('/home');
})

app.get('/home',(req,res)=>{
    res.render('home');
})

app.get('/protected',(req,res)=>{
    res.send('This is protected route');
})

app.listen('3000',()=>{
    console.log('Listening on port 3000!');
});