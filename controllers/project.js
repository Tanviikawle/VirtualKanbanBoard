const Project = require('../models/project');
const User = require('../models/user');
const currentDate = require('../public/javascripts/getDate');
const Task = require('../models/task');

const typeList = ['Personal Project','Group Project']

module.exports.showProjects = async(req,res)=>{
    const projects = await Project.find({}).where('members').elemMatch({$in:req.user._id});
    console.log(projects)
    res.render('project/home',{ projects });
}

module.exports.renderNewProject = (req,res)=>{
    res.render('project/createNewProject');
}

module.exports.addProject = async(req,res)=>{
    try{
        const { title , description , type} = req.body.project;
        const date = currentDate;
        const newProject = new Project({
            title:title,
            description:description,
            date:date,
            type:type,
            creator:req.user._id,
        })
        newProject.members.push(req.user._id);
        const result = await newProject.save()
        res.redirect('/projects');
    }catch(e){
        console.log(e)
        res.render('error',{e});
    }
}

module.exports.showProject = async(req,res)=>{
    const { id } = req.params;
    const project = await Project.findById(id).populate('creator');
    const allTasks = await Task.find({projectId:id}).populate('assignedTo');
    // console.log(allTasks)
    if(!project){
        req.flash('error','Cannot find that project!')
        return res.redirect('/projects')
    }
    res.render('project/show' , {project,allTasks});
}

module.exports.renderUpdateProject = async(req,res)=>{
    const { id } = req.params;
    const project = await Project.findById(id);
    if(!project){
        return res.redirect('/projects')
    }
    res.render('project/update' , {project,typeList});
}

module.exports.updateProject = async(req,res)=>{
    const {id} = req.params;
    const project = await Project.findByIdAndUpdate(id,{...req.body.project});
    await project.save();
    req.flash('success','Successfully updated a project!')
    res.redirect(`/projects/${project.id}`)
}

module.exports.deleteProject = async(req,res)=>{
    const { id } = req.params;
    const result = await Project.findByIdAndDelete(id);
    res.redirect('/projects');
}

module.exports.addNewMember = async(req,res)=>{
    const { id } = req.params;
    try{
        const project = await Project.findById(id).populate('members')
        const isUser = await User.findOne({email:req.body.newMemberEmail});
        let isMember = false;
        for(let p of project.members){
            if(p.email==isUser.email){
                isMember = true;
                break;
            }
        }
        if (!isMember){
            project.members.push(isUser._id);
            const result = await project.save()
            req.flash('success','Successfully added member to group project!')
            res.redirect(`/projects/${id}`)
        }else{
            req.flash('error','User is already roup member of project.')
            res.redirect(`/projects/${id}`)
        }
        
    }catch(e){
        console.log(e)
        req.flash('error',e.message);
        res.render('error');
    }
}

module.exports.renderLeaveProject = async(req,res)=>{
    const { id } = req.params;
    const project = await Project.findById(id);
    res.render('project/leave',{project})
}

module.exports.leaveProject = async(req,res)=>{
    try{
        const { id } = req.params
        const project = await Project.findById(id).populate('members');
        project.members.pull(req.user._id);
        const result = await project.save();
        req.flash('success','Successfully left the project!')
        res.redirect(`/projects`)
    }catch(e){
        console.log(e)
        req.flash('error',e.message);
        res.render('error');
    }
}