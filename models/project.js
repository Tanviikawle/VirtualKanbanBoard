const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
  creator:[{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  title: String,
  description: String,
  tasks: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Task' 
    }],
  date: String,
  members:[{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  type: String,
});

module.exports = mongoose.model('Project',projectSchema);