# Student Library System

A small MERN stack web application with authentication, authorization, CRUD book management, and borrowing records.

## Project Structure

```text
student-library-system/
  backend/     Express.js, Node.js, MongoDB Atlas, JWT auth
  frontend/    React.js, Axios, protected routes
```

## Features

- User registration and login
- JWT authentication
- Role authorization
  - First registered user becomes `admin`
  - Later users become `student`
  - `admin` and `librarian` can create, update, and delete books
  - Authenticated users can browse and borrow books
- Book CRUD
- Borrow and return records
- MongoDB Atlas connection through environment variables
- Axios integration between React and Express

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `backend/.env` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/student-library-system
JWT_SECRET=change_this_to_a_long_secret
CLIENT_URL=http://localhost:5173
PORT=5001
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173` and calls the backend at `http://localhost:5001/api`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/books`
- `POST /api/books` admin/librarian only
- `PUT /api/books/:id` admin/librarian only
- `DELETE /api/books/:id` admin/librarian only
- `GET /api/borrowings`
- `POST /api/borrowings`
- `PATCH /api/borrowings/:id/return`

