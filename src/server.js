//main

const express = require('express');
const {testConnection} = require('./config/databse');
const taskRoutes = require('./routes/taskRoutes');
const { version } = require('react');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

//prase URL-encoded requests
app.use(express.urlencoded({ extended: true }));

//requist logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

//api routes
app.use('/api', taskRoutes);

//root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API', version: '1.0.0', endpoints : {'Get/tasks': 'Retrieve all tasks', 'Get/tasks/:id': 'Retrieve a specific task by ID', 'Post/tasks': 'Create a new task', 'Put/tasks/:id': 'Update an existing task by ID', 'Delete/tasks/:id': 'Delete a task by ID'} });
});

//404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found',message: `Route ${req.method} ${req.path} not found` });
});

//global error handler
app.use((err, req, res, next) => {
    console.error('unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

//start server and test database connection
const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {   
        console.error('Failed to start server:', error);
        process.exit(1);
    }  
    
};

startServer();
