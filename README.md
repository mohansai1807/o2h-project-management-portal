# 🚀 O2H Project Management Portal

A full-stack task management application developed as part of the **o2h Full Stack Application Developer Fresher Hiring Assessment**.

The application enables users to securely register, log in, and manage their personal tasks through a modern React frontend and a robust Express.js backend. Each user can create, update, search, filter, and delete their own tasks while maintaining complete data isolation through JWT-based authentication.

---

## 📌 Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Password Encryption using bcryptjs
* Protected Routes

### Task Management

* Create Tasks
* View All Tasks
* Update Existing Tasks
* Delete Tasks
* Search Tasks
* Filter Tasks by Status
* Pagination Support
* Sorting Support

### Security

* Password Hashing
* JWT Token Verification
* User-specific Task Ownership
* Protected API Endpoints

---

## 🏗️ Project Architecture

```text
o2h-project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── README.md
└── package.json
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MongoDB
* Mongoose

### Testing

* Jest
* Supertest
* MongoDB Memory Server

---

## ⚙️ Prerequisites

Before running the application, ensure you have:

* Node.js (v16 or later)
* npm
* MongoDB (Local or Atlas)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd o2h-project
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment Variables

Navigate to the backend directory:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

---

## ▶️ Running the Application

### Start Frontend & Backend Together

```bash
npm start
```

### Start Backend Only

```bash
npm run dev:backend
```

### Start Frontend Only

```bash
npm run dev:frontend
```

### Run Tests

```bash
npm test
```

---

## 🌐 Default URLs

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:5000 |

---

## 📡 API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Tasks (Protected Routes)

All task routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

#### Get All Tasks

```http
GET /api/tasks
```

Optional Query Parameters:

```text
search
status
sort
page
limit
```

#### Create Task

```http
POST /api/tasks
```

```json
{
  "title": "Complete Assessment",
  "description": "Finish Full Stack Assignment",
  "status": "Pending"
}
```

#### Update Task

```http
PUT /api/tasks/:id
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

---

## 🧪 Testing

Backend testing is implemented using:

* Jest
* Supertest
* MongoDB Memory Server

Run tests using:

```bash
npm test
```

---

## 🔐 Authentication Flow

1. User registers or logs in.
2. Backend generates a JWT token.
3. Token is stored in browser localStorage.
4. Axios automatically attaches the token to API requests.
5. Protected routes validate the token before processing requests.

---

## 📈 Future Improvements

* Task Categories
* Task Priority Levels
* Due Dates & Reminders
* Dark Mode
* User Profile Management
* Drag & Drop Kanban Board
* Docker Deployment

---

## 👨‍💻 Author

Developed as part of the **o2h Full Stack Application Developer Fresher Hiring Assessment**.

Feel free to fork, improve, and contribute to the project.
