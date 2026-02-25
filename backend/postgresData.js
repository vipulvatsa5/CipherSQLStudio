const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'cipher_sandbox',
    password: process.env.PG_PASSWORD || 'password',
    port: process.env.PG_PORT || 5432,
});

const seedSql = `

-- Drop existing tables
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS developers;

-- Create Developers Table
CREATE TABLE developers (
    dev_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(50),
    experience_years INT,
    salary INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Projects Table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    status VARCHAR(50),
    budget INT,
    assigned_dev_id INT REFERENCES developers(dev_id),
    start_date DATE DEFAULT CURRENT_DATE
);

-- Create Tasks Table
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(150),
    project_id INT REFERENCES projects(project_id),
    assigned_to INT REFERENCES developers(dev_id),
    priority VARCHAR(20),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Developers
INSERT INTO developers 
(name, email, department, experience_years, salary, joined_at)
VALUES
('Vipul Kumar', 'vipul@cipher.com', 'Backend', 2, 60000, NOW() - INTERVAL '1 year'),

('Rahul Sharma', 'rahul@cipher.com', 'Frontend', 4, 90000, NOW() - INTERVAL '2 years'),

('Ananya Singh', 'ananya@cipher.com', 'AI/ML', 3, 95000, NOW() - INTERVAL '8 months'),

('Karan Mehta', 'karan@cipher.com', 'DevOps', 5, 120000, NOW() - INTERVAL '3 years'),

('Sneha Patel', 'sneha@cipher.com', 'Backend', 1, 50000, NOW() - INTERVAL '4 months');

-- Insert Projects
INSERT INTO projects
(project_name, status, budget, assigned_dev_id)
VALUES

('CipherSQLStudio Platform', 'Active', 150000, 1),

('AI Resume Analyzer', 'Planning', 100000, 3),

('Cloud Deployment System', 'Active', 200000, 4),

('Mobile Chat Application', 'Completed', 80000, 2),

('Internal Admin Dashboard', 'Active', 60000, 5);

-- Insert Tasks
INSERT INTO tasks
(task_name, project_id, assigned_to, priority, status)
VALUES

('Design Database Schema', 1, 1, 'High', 'Completed'),

('Implement SQL Executor', 1, 1, 'High', 'In Progress'),

('Build Resume Parser', 2, 3, 'Medium', 'Pending'),

('Setup CI/CD Pipeline', 3, 4, 'High', 'In Progress'),

('Develop Chat UI', 4, 2, 'Medium', 'Completed'),

('Create Admin APIs', 5, 5, 'Low', 'Pending');

`;

const postgresData = async () => {
    try {
        console.log('Connecting to PostgreSQL...');
        const client = await pool.connect();
        console.log('Connected. Seeding data...');

        await client.query(seedSql);

        console.log('PostgreSQL seeded successfully with Users and Orders.');
        client.release();
        process.exit();
    } catch (err) {
        console.error('PostgreSQL Seed Error:', err);
        process.exit(1);
    }
};

postgresData();
