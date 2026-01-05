
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