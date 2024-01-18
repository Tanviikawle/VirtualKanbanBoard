const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
  title: String,
  description: String,
  tasks: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Task' 
    }],
    date: String
});

module.exports = mongoose.model('Project',projectSchema);