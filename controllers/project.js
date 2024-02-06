const Project = require('../models/project');
const currentDate = require('../public/javascripts/getDate');
const Task = require('../models/task');

module.exports.showProjects = async(req,res)=>{
    const projects = await Project.find({}).where('members').elemMatch({$in:req.user._id});
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
    const project = await Project.findById(id);
    const allTasks = await Task.find({projectId:id})
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
    res.render('project/update' , {project});
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