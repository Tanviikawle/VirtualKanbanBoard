const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const localStategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');
const currentDate = require('./public/javascripts/getDate');
const Project = require('./models/project');

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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,

    }
}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.currentUser = req.user;
   next();
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    res.render('landingPage');
})

app.get('/login',(req,res)=>{
    res.render('user/login');
})
app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),(req,res)=>{
    const redirectUrl = req.session.returnTo || '/projects';
    // console.log(req.session)
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
})

app.get('/register',(req,res)=>{
    res.render('user/register');
})
app.post('/register',async(req,res)=>{
    try{
        const {email , username , password}=req.body;
        const user = new User({email , username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err =>{
            if(err) return next(err);
            res.redirect('/projects');
        });
    }catch(e){
        res.render('error');
    }
})

app.get('/projects',isLoggedIn,async(req,res)=>{
    const projects = await Project.find({});
    console.log(projects);
    res.render('home',{ projects });
})

app.post('/projects',async(req,res)=>{
    console.log(req.body)
    try{
        const { title , description } = req.body;
        const date = currentDate;
        const newProject = new Project({title:title,description:description,date:date})
        const result = await newProject.save()
        console.log(result);
        res.redirect('/projects');
    }catch(e){
        res.render('error');
    }
})

app.get('/newProject',isLoggedIn,(req,res)=>{
    res.render('createNewProject');
})



app.get('/projects/:id',async(req,res)=>{
    const { id } = req.params;
    const project = await Project.findById(id);
    res.render('show' , {project});
})

app.delete('/projects/:id',async(req,res)=>{
    const { id } = req.params;
    const result = await Project.findByIdAndDelete(id);
    res.redirect('/projects');
})

app.get('/projects/:id/add',(req,res)=>{
    res.render('newTask');
})

app.get('/logout',(req,res,next)=>{
    req.logout(err=>{
        if(err) return next(err);
    });
    res.redirect('/');
})

app.listen('3000',()=>{
    console.log('Listening on port 3000!');
});