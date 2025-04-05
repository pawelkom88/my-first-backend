# My First Backend Project

This is my first attempt at building a full-stack application with backend logic. The project consists of a Node.js/Express backend with a React frontend, demonstrating user authentication with JWT tokens and MongoDB integration.

## Features

- User registration and login system
- JWT-based authentication with access and refresh tokens stored in cookies
- Secure password hashing using bcrypt
- MongoDB database integration
- React frontend with form validation

## Running the Application

The project uses npm scripts defined in `package.json` for various development and build tasks:

### Development Mode

Run both frontend and backend in development mode:

```bash
npm run dev
```

```bash
npm run dev:frontend
```

```bash
npm run dev:backend
```

# Project Structure

This is the folder structure of the project, which separates concerns for better maintainability.

## `/frontend`
- React frontend application

## `/backend`
- Express.js backend API

## `/controllers`
- Request handlers and business logic

## `/middleware`
- Express middleware (auth, security)

## `/models`
- MongoDB data models

## `/routes`
- API route definitions

## `/utils`
- Utility functions

## `/db`
- Database configuration
