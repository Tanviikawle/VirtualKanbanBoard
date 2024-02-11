const Task = require('../models/task');
const Project = require('../models/project');
const currentDate = require('../public/javascripts/getDate');
const getDate = require('../public/javascripts/dueDate')

const statusList = ['All Tasks' , 'Backlog' , 'In Progress','Completed']

module.exports.renderNewTask = async(req,res)=>{
    const { id } = req.params;
    const project = await Project.findById(id).populate('members');
    // console.log(req.user)
    res.render('task/newTask',{id,project});
}

module.exports.createTask = async(req,res)=>{
    try{
        const { id } = req.params;
        const project = await Project.findById(id);
        const { title , description ,status, priority,dueDate,assignedTo} = req.body.task;
        const date = currentDate;
        const newDueDate = getDate(dueDate.replace('-',','));
        const newTask = new Task({
            title:title,
            description:description,
            status:status,
            priority:priority,
            date:date,
            dueDate:newDueDate,
            projectId: id
        })
        // project.type==="Group Project" ?  'assignedTo:task[assignedTo]': 'assignedTo:req.user._id';
        if(project.type=="Group Project"){
            newTask.assignedTo = assignedTo;
        }else{
            newTask.assignedTo = req.user._id;
        }
        const result = await newTask.save()
        // console.log(result)
        res.redirect(`/projects/${id}`);
    }catch(e){
        console.log(e)
        res.render('error');
    }
}

module.exports.showTask = async(req,res)=>{
    const { id,t_id } = req.params;
    const project = await Project.findById(id).populate('creator');
    const task = await Task.findById(t_id).populate('assignedTo');
    if(!task){
        req.flash('error','Cannot find that project!')
        return res.redirect(`/projects/${id}`)
    }
    // console.log(task)
    res.render('task/show',{task,project});
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
    const {id, t_id } = req.params;
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