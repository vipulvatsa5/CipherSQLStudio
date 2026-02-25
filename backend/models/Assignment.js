const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    description: { type: String, required: true },
    question: { type: String, required: true },
    tables: [{
        tableName: String,
        columns: [{ name: String, dataType: String }],
        // Store localized sample data for UI preview (independent of live Sandbox DB)
        previewRows: [{ type: Map, of: String }]
    }],
    solutionQuery: { type: String },
    hint: { type: String }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
