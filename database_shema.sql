CREATE DATABASE IF NOT EXISTS task_management;
USE task_management;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);  

INSERT INTO users (username, email) VALUES
('test_user', 'test@example.com'),
('Nabil', 'nabil@example.com'); 

INSERT INTO tasks (title, description, status, user_id) VALUES
('Sample Task 1', 'This is a sample task description.', 'pending', 1),
('Sample Task 2', 'This is another sample task description.', 'in_progress', 1);
