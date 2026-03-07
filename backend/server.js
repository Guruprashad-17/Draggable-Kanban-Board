const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/kanban_db')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

const Task = mongoose.model('Task', {
    title: String,
    description: String,
    status: { type: String, default: 'To Do' }
});

app.get('/api/tasks', async (req, res) => {
    res.json(await Task.find());
});

app.post('/api/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
});

// DELETE ROUTE ADDED HERE
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.patch('/api/tasks/:id', async (req, res) => {
    const updated = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
});

app.listen(5000, () => console.log('Server on 5000'));