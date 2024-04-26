const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const {projectSchema,taskSchema} = require('./schemas.js');

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

module.exports.validateProject = (req,res,next) => {
    const {error} = projectSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}

module.exports.validateTask = (req,res,next) => {
    const {error} = taskSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}