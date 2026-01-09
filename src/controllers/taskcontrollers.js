
const {pool} = require('../config/databse');


// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const [tasks] = await pool.query('SELECT * FROM tasks Order BY created_at DESC');

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });

    }   
};

// get task by id
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'Task not found' , details: `No task found with id ${id}`});
            }

    
        res.status(200).json(tasks[0]);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    } 
};

// Create a new task

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if(!title) {
            return res.status(400).json({ error: 'Title is required', details: 'Please provide a title for the task' });
        }

        const userId = req.body.userId || 1; // Default to user ID 1 for now

        const [result] = await pool.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
            [title, description || null, status || 'pending', userId]
        );

        const newTask = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

//update tasks


const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const [existingTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (existingTask.length === 0) {
            return res.status(404).json({ error: 'Task not found', details: `No task found with id ${id}` });
        }
        await pool.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
            [title || existingTask[0].title, description || existingTask[0].description, status || existingTask[0].status, id]
        );

        const [updatedTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        res.status(200).json(updatedTask[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const [existingTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (existingTask.length === 0) {
            return res.status(404).json({ error: 'Task not found', details: `No task found with id ${id}` });
        }
        await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }   
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};