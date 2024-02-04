const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = Schema({
  title: String,
  description: String,
  status: String,
  priority: String,
  date: String,
  assignedTo: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
    }],
  projectId:String
});

module.exports = mongoose.model('Task',taskSchema);