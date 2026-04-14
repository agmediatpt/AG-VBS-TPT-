# VBS 2026 - Vacation Bible School Management System

A React-based web application for managing Vacation Bible School registrations, attendance, expenses, and reports.

## Features

- **Registration Management**: Track area registrations and member counts
- **Teacher Attendance**: Monitor teacher attendance for VBS sessions
- **Student Attendance**: Track student participation
- **Expense Tracking**: Manage and categorize expenses
- **Reports**: Generate comprehensive reports
- **Admin Panel**: Administrative settings and controls

## Tech Stack

- **Frontend**: React 19 with Vite
- **Backend**: Express.js with MongoDB
- **Authentication**: Google OAuth
- **Deployment**: Vercel (serverless)

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - For local development: `mongodb://localhost:27017/vbs2026`
   - For production: Use MongoDB Atlas connection string

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Start the backend server:
   ```bash
   node server.js
   ```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 5000 (or as configured)
3. Deploy

### MongoDB Setup

For production deployment on Vercel, you must use MongoDB Atlas (cloud database) since Vercel serverless functions don't support local file storage.

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your Atlas URI

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- Uses ES modules with Vite for fast development
