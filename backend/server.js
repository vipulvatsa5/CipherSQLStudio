const express = require('express');
const cors = require('cors');
const { connectDB, pgPool } = require('./config/db');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'up', timestamp: new Date() });
});

app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/query', require('./routes/query'));
app.use('/api/hints', require('./routes/hints'));

// 3. Global 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 4. Global Error Internal Handler (The "Catch-All")
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        // Only show stack trace in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log('Initializing databases...');
        
        // Connect to MongoDB first
        await connectDB();
        console.log('MongoDB Connected');

        // Verify PostgreSQL connection
        const client = await pgPool.connect();
        console.log('PostgreSQL Connected');
        client.release();

        // Start listening ONLY after DBs are confirmed
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1); 
    }
};

startServer();