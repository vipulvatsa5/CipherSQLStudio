const express = require('express');
const router = express.Router();
const { pgPool } = require('../config/db');
const Assignment = require('../models/Assignment');

router.post('/', async (req, res) => {
    const { sql, assignmentId } = req.body;

    if (!sql || typeof sql !== 'string') {
        return res.status(400).json({ message: "Valid SQL query is required" });
    }

    // 1. Better Sanitization
    // Normalize whitespace and remove comments more robustly
    const cleanSql = sql.replace(/(--.*)|(\/\*[\s\S]*?\*\/)/g, '').trim();
    
    // Check for empty query after comment removal
    if (!cleanSql) return res.status(400).json({ message: "Query is empty." });

    // 2. Stronger Validation
    const upperSql = cleanSql.toUpperCase();
    const isSelect = upperSql.startsWith('SELECT') || upperSql.startsWith('WITH');
    
    // Check for multi-statement queries (the ";" trick)
    if (cleanSql.includes(';') && cleanSql.split(';').filter(s => s.trim()).length > 1) {
        return res.status(400).json({ message: "Security Alert: Multi-statement queries are disabled." });
    }

    if (!isSelect) {
        return res.status(400).json({ message: "Security Alert: Only read-only (SELECT) queries are permitted." });
    }

    // Blacklist check for system-level functions
    const forbidden = ['PG_', 'CURRENT_SETTING', 'SET_CONFIG', 'VERSION('];
    if (forbidden.some(word => upperSql.includes(word))) {
        return res.status(400).json({ message: "Security Alert: Use of system functions is restricted." });
    }

    let client;
    try {
        client = await pgPool.connect();
        
        // 3. Robust Transaction Management
        await client.query('BEGIN');
        // Force the session to be Read-Only for this specific user request
        await client.query('SET TRANSACTION READ ONLY');
        
        // Optional: Set a statement timeout so a user can't run a "loop" query that hangs the CPU
        await client.query('SET statement_timeout = 2000'); // 2 seconds

        const result = await client.query(cleanSql);
        
        // We still rollback to be safe and clean up
        await client.query('ROLLBACK');
        
        return res.json({ rows: result.rows, isMock: false });

    } catch (err) {
        // Handle Postgres being down or query errors
        if (client) await client.query('ROLLBACK').catch(() => {});

        // 4. Improved Fallback Logic
        if (err.code === 'ECONNREFUSED' || !client) {
            console.warn("Postgres Offline - Falling back to Mock data");
            return handleMockFallback(assignmentId, res);
        }

        return res.status(400).json({ 
            message: "SQL Error", 
            error: err.message,
            hint: err.hint // Postgres gives helpful hints (e.g., "did you mean table X?")
        });
    } finally {
        if (client) client.release();
    }
});

// Extracted for cleanliness
async function handleMockFallback(assignmentId, res) {
    if (!assignmentId) return res.status(503).json({ message: "Database offline and no assignment context." });
    
    try {
        const assignment = await Assignment.findById(assignmentId);
        if (assignment?.tables?.[0]?.previewRows) {
            return res.json({
                rows: assignment.tables[0].previewRows,
                isMock: true,
                message: "⚠️ Sandbox Offline: Showing sample data."
            });
        }
    } catch (e) {
        return res.status(503).json({ message: "All data sources are currently unreachable." });
    }
}

module.exports = router;