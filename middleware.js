const User = require('./models/user');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        // console.log(req.session)
        return  res.redirect('/login');
    }
    next();
}

module.exports.isUserRegistered = async(req,res,next)=>{
    const { id } = req.params;
    try{
        const isUser = await User.findOne({email:req.body.newMemberEmail});
        if(isUser== null){
            req.flash('error','Provided email is not registered. Please ask them to register.');
            return res.redirect(`/projects/${id}`);
        }
    }catch(e){
        console.log(e)
        req.flash('error',e.message);
        res.render('error');
    }
    
    next();
}