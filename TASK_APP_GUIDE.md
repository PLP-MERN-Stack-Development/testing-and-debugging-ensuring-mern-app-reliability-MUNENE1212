# Task Management App - Quick Start Guide

## Overview
A full-stack MERN task management application built for Week 6 Testing and Debugging assignment.

## Features
- ✅ Create, Read, Update, Delete (CRUD) tasks
- 📊 Task statistics dashboard
- 🎯 Priority levels (low, medium, high)
- 📅 Due date tracking
- 🏷️ Task tags
- 🔄 Status management (todo, in-progress, completed)
- 🎨 Beautiful, responsive UI
- 🔍 Filter and sort tasks

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Express Validator
- Winston (logging)
- Morgan (HTTP logging)

### Frontend
- React 18
- Vite
- CSS3 (custom styling)
- Fetch API

## Getting Started

### 1. Install Dependencies
```bash
# From the root directory
npm run install-all

# Or manually
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment
Make sure the following files exist:

**server/.env**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-testing
JWT_SECRET=super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
# or on macOS with Homebrew
brew services start mongodb-community
```

### 4. Run the Application

**Option 1: Run both servers concurrently (Recommended)**
```bash
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173 (or the port shown in terminal)
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering and pagination)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

### Query Parameters for GET /api/tasks
- `status` - Filter by status (todo, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (createdAt, dueDate, priority, title)
- `order` - Sort order (asc, desc)

## Task Object Schema

```javascript
{
  title: String (required, 3-100 characters),
  description: String (optional, max 500 characters),
  status: String (todo, in-progress, completed),
  priority: String (low, medium, high),
  dueDate: Date (optional),
  tags: Array of Strings (optional),
  completedAt: Date (auto-set when completed),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Example Usage

### Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete testing assignment",
    "description": "Write comprehensive tests for the task app",
    "priority": "high",
    "dueDate": "2025-01-20",
    "tags": ["school", "urgent"]
  }'
```

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks?status=todo&sortBy=priority&order=desc
```

### Update a Task
```bash
curl -X PUT http://localhost:5000/api/tasks/:taskId \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

## Project Structure

```
server/
├── src/
│   ├── models/
│   │   └── Task.js              # Task mongoose model
│   ├── controllers/
│   │   └── taskController.js    # Task CRUD logic
│   ├── routes/
│   │   └── taskRoutes.js        # Task API routes
│   ├── middleware/
│   │   └── validation.js        # Input validation
│   └── app.js                   # Express app (includes task routes)

client/
├── src/
│   ├── components/
│   │   ├── TaskList.jsx         # Main task list container
│   │   ├── TaskList.css
│   │   ├── TaskForm.jsx         # Create/Edit task form
│   │   ├── TaskForm.css
│   │   ├── TaskItem.jsx         # Individual task display
│   │   └── TaskItem.css
│   ├── App.jsx                  # Root component
│   └── App.css
```

## Testing (To Be Implemented)

As per the Week 6 assignment, you should implement:

### Unit Tests
- Test Task model validations
- Test task controller functions
- Test React components (TaskItem, TaskForm, TaskList)
- Test validation utilities

### Integration Tests
- Test task API endpoints
- Test database operations
- Test error handling

### E2E Tests
- Test complete task creation flow
- Test task update and deletion
- Test filtering and sorting
- Test error scenarios

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check MongoDB status
brew services list | grep mongodb
# or
systemctl status mongod
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Implement Tests**: Add unit, integration, and E2E tests
2. **Add Authentication**: Secure tasks with user authentication
3. **Add User Assignment**: Allow assigning tasks to users
4. **Implement Search**: Add full-text search for tasks
5. **Add Notifications**: Notify users of overdue tasks
6. **Export Data**: Allow exporting tasks to CSV/JSON

## Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Happy Task Managing! 📋✅**
