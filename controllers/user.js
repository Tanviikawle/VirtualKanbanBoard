const User = require('../models/user');

module.exports.renderLogin = (req,res)=>{
    res.render('user/login');
}

module.exports.login = (req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl = req.session.returnTo || '/projects';
    // console.log(req.session)
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
}

module.exports.renderRegister = (req,res)=>{
    res.render('user/register');
}

module.exports.register = async(req,res)=>{
    try{
        const {email , username , password}=req.body;
        const user = new User({email , username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err =>{
            if(err) return next(err);
            req.flash('success','Welcome to Virtual Kanban Boards!');
            res.redirect('/projects');
        });
    }catch(e){
        req.flash('error',e.message);
        // res.render('error');
        res.redirect('/register');
    }
}

module.exports.logout = (req,res,next)=>{
    req.logout(err=>{
        if(err) return next(err);
    });
    req.flash('success','Goodbye!');
    res.redirect('/');
}