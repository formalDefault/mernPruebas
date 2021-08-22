const mongoose = require('mongoose');
const {Schema} = mongoose;

const taskSchema = new Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
})

module.exports = mongoose.model('Task', taskSchema);