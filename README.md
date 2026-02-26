# CipherSQLStudio 🚀

### Browser-Based SQL Learning Platform with AI-Powered Hints

CipherSQLStudio is a modern, full-stack web application designed to help students learn and practice SQL interactively. It provides a real-time SQL execution environment, intelligent AI-powered hints, and pre-configured assignments with sample data.

This platform focuses on improving SQL skills through hands-on learning in a safe PostgreSQL sandbox environment.

---

## 🌐 GitHub Repository

https://github.com/vipulvatsa5/CipherSQLStudio

---

## ✨ Features

### 📚 Assignment Management

* View all SQL assignments
* Difficulty level indicator
* Assignment description and requirements

### 💻 Interactive SQL Workspace

* Monaco Editor (VS Code-like editor)
* Write and execute SQL queries
* Real-time execution against PostgreSQL sandbox

### 📊 Results Panel

* Displays query output in table format
* Shows execution errors clearly

### 🧠 AI-Powered Hint System

* Integrated LLM API
* Provides hints and guidance
* Does NOT reveal full solution

### 🗄 Sample Data Viewer

* View table schemas
* View pre-loaded sample data

---

## 🛠 Tech Stack

### Frontend

* React.js
* SCSS (Vanilla SCSS)
* Monaco Editor
* Axios

### Backend

* Node.js
* Express.js

### Databases

Sandbox Database:

* PostgreSQL

Persistence Database:

* MongoDB Atlas

### AI Integration

* LLM API (OpenAI / Gemini)

---

## 📱 Responsive Design

Built using mobile-first approach

Breakpoints:

* 320px Mobile
* 641px Tablet
* 1024px Laptop
* 1281px Desktop

Uses:

* SCSS variables
* mixins
* nesting
* modular architecture

---

## 📁 Project Structure

```
CipherSQLStudio
│
├── backend
│   ├── routes
│   ├── models
│   ├── db
│   ├── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── styles
│   │
│   ├── public
│
├── package.json
└── README.md
```

---

## ⚙️ Installation Guide

### Clone Repository

```
git clone https://github.com/vipulvatsa5/CipherSQLStudio.git
```

---

## Backend Setup

```
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

Create `.env` file inside backend folder:

```
PG_USER=
PG_PASSWORD=
PG_HOST=
PG_DATABASE=
PG_PORT=

MONGO_URI=

LLM_API_KEY=
```

---

## 🧠 How It Works

1. User selects assignment
2. User writes SQL query
3. Query sent to backend
4. Backend executes in PostgreSQL sandbox
5. Results returned to frontend
6. AI Hint available if user needs help

---

## 🔒 Security

* Query validation implemented
* Sandbox database used
* No schema modification allowed

---

## 📸 Screenshots

/screenshots/assignment.png
<img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/b21f18da-a63d-421c-803b-e186a190e37a" />


/screenshots/workspace.png
<img width="1899" height="924" alt="image" src="https://github.com/user-attachments/assets/91b0af46-69b2-46a0-bca6-b67748ec186b" />

/screenshots/result.png
<img width="1898" height="940" alt="image" src="https://github.com/user-attachments/assets/3bc84e6a-1b28-40e7-bf03-c56c7e3a82a9" />

---

## 🚀 Future Improvements

* User authentication
* Save query attempts
* Leaderboard
* Deployment

---

## 👨‍💻 Author

Vipul Kumar

GitHub:
https://github.com/vipulvatsa5

---

## ⭐ If you like this project

Please consider giving it a star ⭐

---

## 📜 License

This project is for educational purposes.
