const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');
require('dotenv').config();

const sampleAssignments = [

{
title: "1. View All Projects",
difficulty: "Easy",
description: "Your startup wants to see all ongoing projects in the system.",
question: "Write a query to display all columns from the 'projects' table.",
tables: [
{
tableName: "projects",
columns: [
{ name: "project_id", dataType: "INT" },
{ name: "project_name", dataType: "VARCHAR" },
{ name: "status", dataType: "VARCHAR" },
{ name: "budget", dataType: "INT" }
],
previewRows: [
{ project_id: "101", project_name: "AI Chatbot", status: "Active", budget: "50000" },
{ project_id: "102", project_name: "Food Delivery App", status: "Completed", budget: "75000" }
]
}
],
solutionQuery: "SELECT * FROM projects;",
hint: "Use SELECT * and specify the table name."
},

{
title: "2. Find High Budget Projects",
difficulty: "Easy",
description: "Management wants to identify projects with budget more than 60000.",
question: "Write a query to show project_name and budget where budget > 60000.",
tables: [
{
tableName: "projects",
columns: [
{ name: "project_name", dataType: "VARCHAR" },
{ name: "budget", dataType: "INT" }
],
previewRows: [
{ project_name: "Food Delivery App", budget: "75000" },
{ project_name: "Blockchain Wallet", budget: "90000" }
]
}
],
solutionQuery: "SELECT project_name, budget FROM projects WHERE budget > 60000;",
hint: "Use WHERE condition with > operator."
},

{
title: "3. List Developers by Experience",
difficulty: "Medium",
description: "HR wants to sort developers based on experience.",
question: "Display all developers ordered by experience_years in descending order.",
tables: [
{
tableName: "developers",
columns: [
{ name: "dev_id", dataType: "INT" },
{ name: "name", dataType: "VARCHAR" },
{ name: "experience_years", dataType: "INT" }
],
previewRows: [
{ dev_id: "1", name: "Vipul", experience_years: "3" },
{ dev_id: "2", name: "Rahul", experience_years: "5" }
]
}
],
solutionQuery: "SELECT * FROM developers ORDER BY experience_years DESC;",
hint: "Use ORDER BY with DESC."
},

{
title: "4. Count Developers in Each Department",
difficulty: "Medium",
description: "Company wants to see number of developers per department.",
question: "Write a query to count developers grouped by department.",
tables: [
{
tableName: "developers",
columns: [
{ name: "dev_id", dataType: "INT" },
{ name: "department", dataType: "VARCHAR" }
],
previewRows: [
{ dev_id: "1", department: "Backend" },
{ dev_id: "2", department: "Frontend" },
{ dev_id: "3", department: "Backend" }
]
}
],
solutionQuery: "SELECT department, COUNT(*) as total FROM developers GROUP BY department;",
hint: "Use GROUP BY and COUNT."
},

{
title: "5. Join Developers and Projects",
difficulty: "Hard",
description: "Find which developer is working on which project.",
question: "Write a query to display developer name and project name using JOIN.",
tables: [
{
tableName: "developers",
columns: [
{ name: "dev_id", dataType: "INT" },
{ name: "name", dataType: "VARCHAR" }
],
previewRows: [
{ dev_id: "1", name: "Vipul" },
{ dev_id: "2", name: "Rahul" }
]
},
{
tableName: "projects",
columns: [
{ name: "project_id", dataType: "INT" },
{ name: "assigned_dev_id", dataType: "INT" },
{ name: "project_name", dataType: "VARCHAR" }
],
previewRows: [
{ project_id: "101", assigned_dev_id: "1", project_name: "AI Chatbot" },
{ project_id: "102", assigned_dev_id: "2", project_name: "Blockchain Wallet" }
]
}
],
solutionQuery:
"SELECT developers.name, projects.project_name FROM developers JOIN projects ON developers.dev_id = projects.assigned_dev_id;",
hint: "Use JOIN with ON condition."
},

{
title: "6. Subquery: Highest Paid Developer",
difficulty: "Hard",
description: "Find the developer with highest salary.",
question: "Write a query to display name of developer with maximum salary.",
tables: [
{
tableName: "developers",
columns: [
{ name: "name", dataType: "VARCHAR" },
{ name: "salary", dataType: "INT" }
],
previewRows: [
{ name: "Vipul", salary: "80000" },
{ name: "Rahul", salary: "120000" }
]
}
],
solutionQuery:
"SELECT name FROM developers WHERE salary = (SELECT MAX(salary) FROM developers);",
hint: "Use subquery with MAX."
}

];

const mongoDBdata = async () => {
    try {
        console.log('Using Mongo URI:', process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);

        await Assignment.deleteMany({});
        console.log('Cleared existing assignments');

        await Assignment.insertMany(sampleAssignments);
        console.log('Seeded 5 sample assignments with PREVIEW DATA successfully');

        process.exit();
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

mongoDBdata();
