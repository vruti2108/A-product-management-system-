# MERN Product Management System

A full-stack product management application built with MongoDB, Express.js, React.js, and Node.js.

## Features

- User Authentication (Signup/Login)
- JWT Token-based Authorization
- Product CRUD Operations (Create, Read, Update, Delete)
- Responsive UI Design
- Secure Password Hashing

## Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `PORT` - Server port (default: 5000)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

## Deployment

- Backend: Vercel
- Frontend: Vercel
- Database: MongoDB Atlas

## Author

Your Name

## License

MIT