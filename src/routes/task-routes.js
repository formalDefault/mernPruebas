const express = require('express');
const router = express.Router();
const Task = require('../models/task'); //Schema de documento de inserto o actualizacion mongodb

//select * from [tabla]
router.get('/', async (req, res) => {
    const tasks = await Task.find() ; 
    res.json(tasks);
});
//select id from [tabla]
router.get('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.json(task);
});
//insert into 
router.post('/', async (req, res) => {
    const title = req.body.titulo;
    const description = req.body.descripcion;;
    const task = new Task({title, description})
    await task.save();
    res.json({status: `tarea guardada`});
});
//update
router.put('/:id', async (req, res) => { 
    const title = req.body.titulo;
    const description = req.body.descripcion;;
    const newTask = {title, description};
    await Task.findByIdAndUpdate(req.params.id, newTask);
    res.json({status: "tarea actualizada"});
});
//delete
router.delete('/:id', async (req, res) => { 
    await Task.findByIdAndRemove(req.params.id);
    res.json({status: `tarea ${req.params.id} borrada`});
})

module.exports = router;