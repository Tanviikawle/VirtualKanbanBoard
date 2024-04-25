const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const methodOverride = require('method-override');
const passport = require('passport');
const localStategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn,isUserRegistered,validateProject,validateTask } = require('./middleware');
const currentDate = require('./public/javascripts/getDate');
const Project = require('./models/project');
const Task = require('./models/task');
const tasks = require('./controllers/task');
const users = require('./controllers/user');
const projects = require('./controllers/project')
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');


//Database Connection
mongoose.connect('mongodb://localhost:27017/kanban',{});

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
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
 })

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    res.render('landingPage');
})

//User routes
app.get('/login',users.renderLogin)
app.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo: true}),users.login)
app.get('/register',users.renderRegister)
app.post('/register',users.register)

//Project routes
app.get('/projects',isLoggedIn,catchAsync(projects.showProjects));
app.post('/projects',validateProject,catchAsync(projects.addProject))
app.get('/newProject',isLoggedIn,catchAsync(projects.renderNewProject))
app.get('/projects/:id',catchAsync(projects.showProject))
app.get('/projects/:id/info',catchAsync(projects.showProjectInfo))
app.get('/projects/:id/update',catchAsync(projects.renderUpdateProject))
app.put('/projects/:id', catchAsync(projects.updateProject))
app.delete('/projects/:id',catchAsync(projects.deleteProject))
app.get('/projects/:id/analysis',catchAsync(projects.showAnalysis))
app.get('/projects/:id/leave',catchAsync(projects.renderLeaveProject))
app.post('/projects/:id/leave',catchAsync(projects.leaveProject))
app.get('/projects/:id/newMember',catchAsync(projects.renderAddNewMember))
app.post('/projects/:id/n',isUserRegistered,catchAsync(projects.addNewMember))

//Task routes
app.get('/projects/:id/add',isLoggedIn,catchAsync(tasks.renderNewTask))
app.post('/projects/:id/t',isLoggedIn,validateTask,catchAsync(tasks.createTask))
app.get('/projects/:id/t/:t_id',catchAsync(tasks.showTask))
app.delete('/projects/:id/t/:t_id',isLoggedIn,catchAsync(tasks.deleteTask))
app.get('/projects/:id/t/:t_id/update',isLoggedIn,catchAsync(tasks.renderUpdate))
app.put('/projects/:id/t/:t_id',isLoggedIn,catchAsync(tasks.updateTask))

app.get('/logout', isLoggedIn,users.logout)

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something wenr wrong!'
    res.status(statusCode).render('error',{err});
})

app.listen('3000',()=>{
    console.log('Listening on port 3000!');
});