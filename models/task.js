const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = Schema({
  title: String,
  description: String,
  status: String,
  priority: String,
  date: String,
  dueDate: String,
  assignedTo: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
    }],
  projectId:[{ 
    type: Schema.Types.ObjectId, 
    ref: 'Project' 
    }]
});

module.exports = mongoose.model('Task',taskSchema);