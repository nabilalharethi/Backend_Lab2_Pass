
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