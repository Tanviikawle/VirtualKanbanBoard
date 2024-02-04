const Project = require('../models/project');
const User = require('../models/user');
const Task = require('../models/task');
const currentDate = require('../public/javascripts/getDate');

const statusList = ['All Tasks' , 'Backlog' , 'In Progress','Completed']

module.exports.renderNewTask = (req,res)=>{
    const { id } = req.params;
    // console.log(req.user)
    res.render('task/newTask',{id});
}

module.exports.createTask = async(req,res)=>{
    try{
        const { id } = req.params;
        const { title , description ,status, priority} = req.body.task;
        const date = currentDate;
        const newTask = new Task({
            title:title,
            description:description,
            status:status,
            priority:priority,
            assignedTo:req.user._id,
            date:date,
            projectId: id
        })
        const result = await newTask.save()
        res.redirect(`/projects/${id}`);
    }catch(e){
        // console.log(e)
        res.render('error');
    }
}

module.exports.showTask = async(req,res)=>{
    const { id,t_id } = req.params;
    const task = await Task.findById(t_id);
    if(!task){
        // req.flash('error','Cannot find that project!')
        return res.redirect(`/projects/${id}`)
    }
    console.log(task)
    res.render('task/show',{task});
}

module.exports.deleteTask = async(req,res)=>{
    const { id,t_id } = req.params;
    try{
        const result = await Task.findByIdAndDelete(t_id);
        res.redirect(`/projects/${ id }`);
    }catch(e){
        res.render('error');
    }
}

module.exports.renderUpdate = async(req,res)=>{
    const { t_id } = req.params;
    try{
        const task = await Task.findById(t_id);
        res.render('task/update',{task,statusList});
    }catch(e){
        res.render('error');
    }
}

module.exports.updateTask = async(req,res)=>{
    try{
        const {id,t_id} = req.params;
        const updatedTask = await Task.findByIdAndUpdate(t_id,{...req.body.task})
        await updatedTask.save();
        res.redirect(`/projects/${id}/t/${t_id}`);
    }catch(e){
        res.render('error');
    }
}