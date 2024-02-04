const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
  // admin:[{ 
  //   type: Schema.Types.ObjectId, 
  //   ref: 'User' 
  // }],
  title: String,
  description: String,
  tasks: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Task' 
    }],
  date: String
});

module.exports = mongoose.model('Project',projectSchema);