
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
