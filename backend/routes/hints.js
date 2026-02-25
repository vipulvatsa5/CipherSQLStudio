const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const axios = require('axios');

router.post('/', async (req, res) => {
    const { assignmentId, userQuery } = req.body;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        const apiKey = process.env.LLM_API_KEY;

        // 1. Better Mock/Config Management
        if (process.env.USE_MOCK_HINTS === 'true' || !apiKey || apiKey === 'your_key_here') {
            return res.json({
                hint: `💡 Hint: ${assignment.hint || "Check your JOIN logic or column names."}`,
                isMock: true
            });
        }

        // 2. Build a "Schema Context" string
        // This helps the AI understand the DB structure without guessing
        const schemaContext = assignment.tables?.map(t => 
            `Table: ${t.tableName} (Columns: ${t.columns.join(', ')})`
        ).join(' | ');

        try {
            const llmRes = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4o-mini", // Better reasoning for 2026, cheaper than 3.5 was
                messages: [
                    { 
                        role: "system", 
                        content: `You are a Socratic SQL Tutor for CipherSQLStudio. 
                        Your goal is to guide students toward the answer without ever giving them the SQL code.
                        
                        RULES:
                        - NEVER provide code blocks or snippets.
                        - NEVER reveal the 'Hidden Solution'.
                        - If the user asks for the answer, politely refuse and give a conceptual hint instead.
                        - Use the provided Schema to verify if their logic makes sense.
                        - Keep responses under 3 sentences.` 
                    },
                    { 
                        role: "user", 
                        content: `
                        CONTEXT:
                        - Assignment: "${assignment.question}"
                        - Database Schema: ${schemaContext}
                        - Hidden Correct Solution: "${assignment.solutionQuery}"
                        
                        STUDENT'S CURRENT QUERY:
                        "${userQuery || "I'm stuck, help me start."}"
                        
                        Give the student a helpful hint:` 
                    }
                ],
                temperature: 0.7, // Adds a bit of variety to hints
                max_tokens: 150
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });

            const hint = llmRes.data.choices[0].message.content;
            res.json({ hint });

        } catch (apiErr) {
            console.error("LLM API Fail:", apiErr.message);
            res.json({ hint: `💡 ${assignment.hint || "Review your SELECT and FROM clauses."}` });
        }

    } catch (err) {
        res.status(500).json({ message: "Internal server error while fetching hint." });
    }
});

module.exports = router;