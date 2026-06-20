# Mini Project Management Portal

A full-stack project management application built for the **o2h Full Stack Application Developer Fresher Hiring Assessment**. 

This application allows users to manage their project tasks with features like viewing, filtering, creating, updating, and deleting tasks. It includes both the core assessment features and advanced features such as JWT Authentication, Task Search, Sorting, Pagination, Dashboard Statistics, and Dark Mode.

---

## Table of Contents
1. [Implementation Plan & Architecture](#implementation-plan--architecture)
2. [Project Folder Structure](#project-folder-structure)
3. [Setup & Installation](#setup--installation)
4. [Assumptions Made](#assumptions-made)
5. [API Documentation](#api-documentation)
6. [Tech Stack](#tech-stack)

---

## Implementation Plan & Architecture

The application is structured as a decoupled client-server project:
1. **Frontend**: React-based Single Page Application (SPA) built using Vite. It consumes the REST APIs using Axios. Styling is done via custom Vanilla CSS (with CSS variables for light/dark modes and modern glassmorphism panels).
2. **Backend**: Node.js and Express REST API server. Handles authentication (JWT) and data storage.
3. **Database**: MongoDB (using Mongoose ODM) to store user credentials and task records.
4. **Authentication**: JWT-based token authentication. The token is stored securely in `localStorage` on the frontend and attached to API requests via an Axios interceptor.

---

## Project Folder Structure

Adheres to the expected folder structure specified in the assessment:

```text
o2h-project-management-portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js     # User registration and login controller
│   │   └── taskController.js     # CRUD controllers for Tasks
│   ├── models/
│   │   ├── User.js               # Mongoose Schema for User
│   │   └── Task.js               # Mongoose Schema for Task
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints (/api/auth/*)
│   │   └── taskRoutes.js         # Task endpoints (/api/tasks/*)
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT validation middleware
│   │   └── errorMiddleware.js    # Global error handling middleware
│   ├── tests/
│   │   └── task.test.js          # Unit tests for the Backend APIs
│   ├── .env.example              # Template for environment variables
│   ├── server.js                 # Entry point of the Express application
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardStats.jsx # Task count cards (Total, Pending, Completed)
│   │   │   ├── DarkModeToggle.jsx # Button to toggle dark/light theme
│   │   │   ├── Navbar.jsx        # Navigation bar with user profile/logout
│   │   │   ├── TaskCard.jsx       # Individual task item card
│   │   │   └── TaskFilter.jsx     # Search, filter, sort, and pagination UI
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Task dashboard containing stats, filters, and list
│   │   │   ├── AddTask.jsx        # Add task form page with client-side validation
│   │   │   ├── Login.jsx          # Login page with beautiful glassmorphism style
│   │   │   └── Register.jsx       # Registration page
│   │   ├── services/
│   │   │   ├── api.js             # Central Axios instance with JWT interceptor
│   │   │   ├── authService.js     # Functions for Login/Register/Logout
│   │   │   └── taskService.js     # Functions for GET, POST, PUT, DELETE tasks
│   │   ├── index.css              # Global custom stylesheet (tokens, theme colors, dark mode)
│   │   ├── App.jsx                # Main application component with Router
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md                      # This documentation
└── package.json                   # Root package.json to run both frontend and backend concurrently
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16+) installed.
- MongoDB installed locally and running (typically on `mongodb://localhost:27017`) or a MongoDB Atlas URI.

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd o2h-project-management-portal
```

### Step 2: Install dependencies
Install all root, backend, and frontend dependencies in one command:
```bash
npm run install:all
```

### Step 3: Configure Environment Variables
1. Navigate to the `backend/` directory.
2. Copy `.env.example` to `.env`.
3. Configure the variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Step 4: Start the application
Run the following command in the root directory to run both frontend and backend concurrently:
```bash
npm start
```
- **Backend** will run on `http://localhost:5000`
- **Frontend** will run on `http://localhost:5173` (Vite default dev server)

### Running Tests
To run backend unit tests:
```bash
npm test
```

---

## Assumptions Made
1. **User Ownership**: Tasks are scoped per user. Users can only see, create, edit, or delete tasks that belong to their own account.
2. **MongoDB Connection**: A local MongoDB database running at `mongodb://localhost:27017/task_db` is assumed as default. If not available, users should update the `MONGO_URI` env variable.
3. **Authentication**: Authentication is required for all task-related routes. Registration and Login are public.
4. **Description Constraint**: The assessment specifies that the task description must have a minimum of 20 characters. This validation is enforced on both the client (frontend) and database/server level (backend).

---

## API Documentation

All endpoints are prefixed with `/api`. All task endpoints require a valid JWT passed in the HTTP `Authorization` header as a Bearer token: `Bearer <token>`.

### Authentication
* **POST `/auth/register`**
  - Description: Register a new user.
  - Request body: `{ "username": "jane", "email": "jane@example.com", "password": "password123" }`
  - Response: `{ "token": "<JWT_TOKEN>", "user": { "id": "...", "username": "jane", "email": "..." } }`
* **POST `/auth/login`**
  - Description: Log in an existing user.
  - Request body: `{ "email": "jane@example.com", "password": "password123" }`
  - Response: `{ "token": "<JWT_TOKEN>", "user": { "id": "...", "username": "jane", "email": "..." } }`

### Tasks
* **GET `/tasks`**
  - Description: Retrieve all tasks of the logged-in user.
  - Query parameters (optional):
    - `search`: Filter tasks by searching title or description (case-insensitive).
    - `status`: Filter by status (`Pending`, `In Progress`, `Completed`).
    - `sort`: Sort by field (e.g. `createdAt:desc` or `createdAt:asc`).
    - `page`: Page number (default: `1`).
    - `limit`: Number of items per page (default: `6`).
  - Response: `{ "tasks": [...], "totalPages": 3, "currentPage": 1, "totalTasks": 18 }`
* **POST `/tasks`**
  - Description: Create a new task.
  - Request body: `{ "title": "...", "description": "...", "status": "Pending" | "In Progress" }`
  - Response: Created task object with `_id`, `title`, `description`, `status`, `createdAt`, `user`.
* **PUT `/tasks/:id`**
  - Description: Update task details or status.
  - Request body: `{ "status": "Completed" }` (or any other field)
  - Response: Updated task object.
* **DELETE `/tasks/:id`**
  - Description: Delete a task.
  - Response: `{ "message": "Task deleted successfully" }`

---

## Tech Stack
- **Frontend**: React (Vite), React Router v6, Axios, Vanilla CSS Variables & Keyframes.
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs for password hashing.
- **Database**: MongoDB (Mongoose).
- **Testing**: Jest, Supertest, Mongo-Memory-Server.
#   o 2 h - p r o j e c t - m a n a g e m e n t - p o r t a l  
 