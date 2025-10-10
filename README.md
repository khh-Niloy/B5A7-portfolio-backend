# B5A7 Portfolio Backend

A comprehensive backend API for a personal portfolio website built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Live Deployment

**Backend API:** [https://b5a7-portfolio-backend.vercel.app/](https://b5a7-portfolio-backend.vercel.app/)

## 📋 Project Overview

This is a full-featured backend API that powers a personal portfolio website. It provides endpoints for managing portfolio content including personal information, skills, projects, blog posts, and user authentication with role-based access control.

### ✨ Features

- **🔐 Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (Admin/User)
  - Secure password hashing with bcrypt
  - Cookie-based session management

- **📝 Content Management**
  - **About Section**: Personal information and bio management
  - **Skills**: Categorized skills with CRUD operations
  - **Projects**: Project showcase with image uploads
  - **Blog**: Blog post management with file uploads

- **🖼️ File Upload**
  - Cloudinary integration for image storage
  - Multer middleware for file handling
  - Support for multiple file uploads

- **🛡️ Security**
  - CORS configuration for frontend integration
  - Environment variable validation
  - Input sanitization and validation

- **📊 Database**
  - MongoDB with Mongoose ODM
  - Structured data models
  - Data validation and relationships

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary
- **Security**: bcryptjs, cors, cookie-parser
- **Environment**: dotenv

### Development Tools
- **Build Tool**: TypeScript Compiler
- **Development Server**: ts-node-dev
- **Linting**: ESLint
- **Package Manager**: npm

### Deployment
- **Platform**: Vercel
- **Build Process**: TypeScript compilation to JavaScript

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or cloud)
- Cloudinary account for file storage

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/b5a7-portfolio-backend.git
cd b5a7-portfolio-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000
FRONTEND_URLS=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/portfolio-db

# JWT Configuration
JWT_ACCESS_SECRET=your-access-secret-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES=7d

# Password Hashing
BCRYPT_SALT_ROUND=12

# Admin Credentials
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your-secure-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Database Setup
Ensure MongoDB is running and accessible with the connection string provided in `MONGO_URI`.

### 5. Development Server
```bash
npm run server
```

The server will start on `http://localhost:5000` with hot reload enabled.

### 6. Production Build
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/get-me` - Get current user (protected)

### About
- `POST /api/v1/about/about-content` - Create about content
- `GET /api/v1/about/about-content` - Get about content
- `PATCH /api/v1/about/about-content/:id` - Update about content

### Skills
- `GET /api/v1/skills/skills` - Get all skills
- `POST /api/v1/skills/skills/add-skills-to-category` - Add skills to category
- `POST /api/v1/skills/skills/upsert-skills-for-category` - Upsert skills for category

### Projects
- `GET /api/v1/projects/` - Get all projects
- `GET /api/v1/projects/:id` - Get project by ID
- `POST /api/v1/projects/` - Create project (with file upload)
- `PATCH /api/v1/projects/:id` - Update project (with file upload)

### Blog
- `GET /api/v1/blog/` - Get all blog posts
- `GET /api/v1/blog/:id` - Get blog post by ID
- `POST /api/v1/blog/` - Create blog post (with file upload)
- `PATCH /api/v1/blog/:id` - Update blog post (with file upload)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── config/           # Configuration files
│   │   ├── cloudinary.config.ts
│   │   ├── envVars.ts
│   │   └── multer.config.ts
│   ├── interface/        # TypeScript interfaces
│   ├── middleware/       # Custom middleware
│   ├── modules/          # Feature modules
│   │   ├── about/        # About section
│   │   ├── auth/         # Authentication
│   │   ├── blog/         # Blog management
│   │   ├── projects/     # Project management
│   │   └── skills/       # Skills management
│   ├── routes.ts         # Main routes configuration
│   └── utils/            # Utility functions
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## 🔧 Available Scripts

- `npm run server` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration for cross-origin requests
- Environment variable validation
- Role-based access control
- Secure cookie handling

## 📝 Notes

- The application uses TypeScript for type safety and better development experience
- File uploads are handled through Cloudinary for reliable cloud storage
- The API is designed to work seamlessly with the frontend portfolio application
- All sensitive data is stored in environment variables
- The application includes automatic admin user seeding for initial setup