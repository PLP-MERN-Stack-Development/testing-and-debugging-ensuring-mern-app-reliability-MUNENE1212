# 🧪 MERN Stack Testing & Debugging Application

> **Week 6 Assignment**: Comprehensive testing strategies and debugging techniques for MERN stack applications

A full-stack MERN (MongoDB, Express, React, Node.js) application demonstrating professional testing methodologies including unit testing, integration testing, and end-to-end testing, along with robust debugging implementations.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?logo=jest)](https://jestjs.io/)
[![Cypress](https://img.shields.io/badge/Cypress-13.6.2-17202C?logo=cypress)](https://www.cypress.io/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Testing Strategy](#-testing-strategy)
- [Debugging](#-debugging)
- [Code Coverage](#-code-coverage)
- [Project Highlights](#-project-highlights)
- [Resources](#-resources)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 📋 **Task Management**: Full CRUD operations for tasks
- ✅ **Task Status**: Track tasks as todo, in-progress, or completed
- 🎯 **Priority Levels**: Set task priorities (low, medium, high)
- 📅 **Due Dates**: Assign and track task deadlines
- 🏷️ **Tags**: Organize tasks with custom tags
- 📊 **Statistics**: View task stats by status and priority
- 🔐 **User Authentication**: JWT-based authentication with secure password hashing (optional)
- 📄 **Filtering & Sorting**: Filter by status and sort by various criteria

### Testing Features
- ✅ **Unit Tests**: Individual function and component testing
- 🔗 **Integration Tests**: API endpoint and database testing
- 🎭 **End-to-End Tests**: Complete user flow testing with Cypress
- 📊 **Code Coverage**: Comprehensive coverage reporting (70%+ target)
- 🎯 **Test Data Management**: MongoDB Memory Server for isolated testing

### Debugging Features
- 📝 **Structured Logging**: Winston logger with different log levels
- 🛡️ **Error Boundaries**: React error boundaries for graceful error handling
- 🚨 **Global Error Handler**: Centralized Express error handling
- 🔍 **HTTP Logging**: Morgan middleware for request logging
- 🐛 **Debug Mode**: Development-friendly error messages and stack traces

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing
- **React Testing Library** - Component testing
- **Cypress** - E2E testing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Winston** - Logging
- **Morgan** - HTTP request logging

### Testing Tools
- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **MongoDB Memory Server** - In-memory database for tests
- **Cypress** - End-to-end testing
- **React Testing Library** - React component testing

### Development Tools
- **Nodemon** - Auto-restart server
- **Babel** - JavaScript transpiler
- **ESLint** (optional) - Code linting
- **Concurrently** - Run multiple commands

---

## 📂 Project Structure

```
testing-and-debugging-ensuring-mern-app-reliability/
│
├── 📁 client/                          # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable React components
│   │   │   ├── Button.jsx              # Button component with variants
│   │   │   ├── Button.css              # Button styles
│   │   │   └── ErrorBoundary.jsx       # Error handling component
│   │   ├── 📁 hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js              # Authentication hook
│   │   │   └── usePosts.js             # Posts management hook
│   │   ├── 📁 utils/                   # Utility functions
│   │   │   ├── validation.js           # Input validation utilities
│   │   │   └── formatters.js           # Data formatting utilities
│   │   ├── 📁 tests/                   # Client-side tests
│   │   │   ├── 📁 unit/                # Unit tests
│   │   │   │   ├── Button.test.jsx
│   │   │   │   ├── validation.unit.test.jsx
│   │   │   │   └── formatters.unit.test.jsx
│   │   │   ├── 📁 integration/         # Integration tests
│   │   │   │   └── useAuth.integration.test.jsx
│   │   │   ├── 📁 __mocks__/           # Mock files
│   │   │   │   └── fileMock.js
│   │   │   └── setup.js                # Test configuration
│   │   ├── App.jsx                     # Root component
│   │   ├── App.css                     # App styles
│   │   ├── main.jsx                    # App entry point
│   │   └── index.css                   # Global styles
│   ├── 📁 cypress/                     # End-to-end tests
│   │   ├── 📁 e2e/
│   │   │   ├── app.cy.js               # App E2E tests
│   │   │   └── auth.cy.js              # Authentication E2E tests
│   │   └── 📁 support/
│   │       ├── commands.js             # Custom Cypress commands
│   │       └── e2e.js                  # Cypress setup
│   ├── index.html                      # HTML template
│   ├── package.json                    # Client dependencies
│   ├── vite.config.js                  # Vite configuration
│   └── cypress.config.js               # Cypress configuration
│
├── 📁 server/                          # Express Backend Application
│   ├── 📁 src/
│   │   ├── 📁 models/                  # Mongoose models
│   │   │   ├── User.js                 # User model with bcrypt
│   │   │   ├── Post.js                 # Post model
│   │   │   └── Category.js             # Category model
│   │   ├── 📁 controllers/             # Route controllers
│   │   │   ├── authController.js       # Authentication logic
│   │   │   └── postController.js       # Post CRUD operations
│   │   ├── 📁 routes/                  # API route definitions
│   │   │   ├── authRoutes.js           # Auth endpoints
│   │   │   └── postRoutes.js           # Post endpoints
│   │   ├── 📁 middleware/              # Custom middleware
│   │   │   ├── auth.js                 # JWT authentication
│   │   │   ├── errorHandler.js         # Global error handler
│   │   │   └── validation.js           # Input validation
│   │   ├── 📁 utils/                   # Utility functions
│   │   │   ├── auth.js                 # JWT token utilities
│   │   │   └── logger.js               # Winston logger config
│   │   ├── 📁 config/
│   │   │   └── database.js             # MongoDB connection
│   │   ├── app.js                      # Express app setup
│   │   └── server.js                   # Server entry point
│   ├── 📁 tests/                       # Server-side tests
│   │   ├── 📁 unit/                    # Unit tests
│   │   │   └── auth.unit.test.js       # Auth utilities tests
│   │   ├── 📁 integration/             # Integration tests
│   │   │   ├── auth.test.js            # Auth API tests
│   │   │   └── posts.test.js           # Posts API tests
│   │   └── setup.js                    # Test configuration
│   ├── 📁 scripts/
│   │   └── setupTestDb.js              # Test database setup
│   ├── 📁 logs/                        # Log files directory
│   ├── .env                            # Environment variables
│   ├── .env.example                    # Example env file
│   └── package.json                    # Server dependencies
│
├── 📄 jest.config.js                   # Jest configuration
├── 📄 .babelrc                         # Babel configuration
├── 📄 .gitignore                       # Git ignore rules
├── 📄 package.json                     # Root dependencies
├── 📄 TESTING_GUIDE.md                 # Testing documentation
├── 📄 DEBUGGING_GUIDE.md               # Debugging guide
├── 📄 SETUP_SUMMARY.md                 # Complete setup guide
├── 📄 Week6-Assignment.md              # Assignment instructions
└── 📄 README.md                        # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Can also use MongoDB Atlas (cloud database)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Optional Tools
- **MongoDB Compass** - GUI for MongoDB
- **Postman** or **Insomnia** - API testing
- **VS Code** - Recommended code editor

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd testing-and-debugging-ensuring-mern-app-reliability-MUNENE1212
```

### 2. Install Dependencies

Install all dependencies for root, server, and client:

```bash
# Install all at once (recommended)
npm run install-all

# OR install separately
npm install                  # Root dependencies
cd server && npm install     # Server dependencies
cd ../client && npm install  # Client dependencies
```

---

## ⚙️ Configuration

### 1. Server Environment Variables

Create or edit `server/.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/mern-testing

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

**Important**: Never commit the `.env` file. Use `.env.example` as a template.

### 2. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## 🎮 Running the Application

### Development Mode

**Option 1: Run Both Servers Concurrently (Recommended)**
```bash
npm run dev
```
This starts:
- Backend server on `http://localhost:5000`
- Frontend server on `http://localhost:3000`

**Option 2: Run Servers Separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Production Mode

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

---

## 🧪 Testing

This project includes comprehensive testing at multiple levels.

### Run All Tests
```bash
npm test
```

### Unit Tests
Test individual functions and components in isolation.

```bash
# All unit tests
npm run test:unit

# With coverage
npm run test:unit -- --coverage

# Watch mode
npm run test:watch
```

**Example Unit Tests:**
- ✅ Authentication utilities
- ✅ Validation functions
- ✅ React components (Button)
- ✅ Formatting utilities

### Integration Tests
Test how different parts work together (API + Database).

```bash
# All integration tests
npm run test:integration

# Server integration tests only
cd server
npm run test:integration
```

**Example Integration Tests:**
- ✅ User registration endpoint
- ✅ User login endpoint
- ✅ Protected routes
- ✅ Post CRUD operations
- ✅ Database operations

### End-to-End Tests
Test complete user workflows with Cypress.

```bash
# Make sure dev servers are running first
npm run dev

# In another terminal, run E2E tests
npm run test:e2e

# Or headless mode
cd client
npm run test:e2e:headless
```

**Example E2E Tests:**
- ✅ User registration flow
- ✅ User login flow
- ✅ Protected routes access
- ✅ Post creation and management
- ✅ Navigation flows

### Test Coverage

Generate comprehensive coverage reports:

```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser to view detailed coverage.

**Coverage Thresholds:**
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": { ... }
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "user": { ... }
}
```

#### Update Password (Protected)
```http
PUT /api/auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks?page=1&limit=10&status=todo&priority=high&sortBy=createdAt&order=desc

Response: 200 OK
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "task-id",
      "title": "Complete project documentation",
      "description": "Write comprehensive README",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2025-01-20T00:00:00.000Z",
      "tags": ["documentation", "urgent"],
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Task
```http
GET /api/tasks/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "task-id",
    "title": "Complete project documentation",
    "description": "Write comprehensive README",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2025-01-20T00:00:00.000Z",
    "tags": ["documentation", "urgent"],
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description here...",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2025-01-25T00:00:00.000Z",
  "tags": ["work", "important"]
}

Response: 201 Created
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... }
}
```

#### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "completed",
  "priority": "low"
}

Response: 200 OK
{
  "success": true,
  "message": "Task updated successfully",
  "data": { ... }
}
```

#### Delete Task
```http
DELETE /api/tasks/:id

Response: 200 OK
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {}
}
```

#### Get Task Statistics
```http
GET /api/tasks/stats/overview

Response: 200 OK
{
  "success": true,
  "data": {
    "byStatus": [
      { "_id": "todo", "count": 10 },
      { "_id": "in-progress", "count": 5 },
      { "_id": "completed", "count": 15 }
    ],
    "byPriority": [
      { "_id": "low", "count": 8 },
      { "_id": "medium", "count": 12 },
      { "_id": "high", "count": 10 }
    ],
    "overdue": 3
  }
}
```

### Error Responses

```http
400 Bad Request - Validation error
{
  "error": "Validation failed",
  "details": [ ... ]
}

401 Unauthorized - Authentication required
{
  "error": "Not authorized - No token provided"
}

403 Forbidden - Insufficient permissions
{
  "error": "Forbidden - You do not have permission"
}

404 Not Found - Resource not found
{
  "error": "Route /api/invalid not found"
}

500 Internal Server Error
{
  "status": "error",
  "message": "Something went wrong"
}
```

---

## 🎯 Testing Strategy

### Testing Pyramid

```
        /\
       /  \
      / E2E \
     /______\
    /        \
   /Integration\
  /____________\
 /              \
/  Unit Tests    \
/__________________\
```

### 1. Unit Tests (Base Layer - 70%)
- **Focus**: Test individual functions in isolation
- **Speed**: Very fast (milliseconds)
- **Coverage**: Highest number of tests
- **Tools**: Jest, React Testing Library

**What we test:**
- Utility functions (validation, formatting, auth)
- React components (rendering, props, events)
- Custom hooks (state, effects)
- Model methods (Mongoose)

### 2. Integration Tests (Middle Layer - 20%)
- **Focus**: Test how parts work together
- **Speed**: Medium (seconds)
- **Coverage**: Moderate number of tests
- **Tools**: Jest, Supertest, MongoDB Memory Server

**What we test:**
- API endpoints with database
- Authentication flows
- Database operations
- Request/response cycles

### 3. End-to-End Tests (Top Layer - 10%)
- **Focus**: Test complete user workflows
- **Speed**: Slower (seconds to minutes)
- **Coverage**: Fewer tests, critical paths only
- **Tools**: Cypress

**What we test:**
- User registration and login
- Complete CRUD workflows
- Navigation between pages
- Error scenarios

### Test Data Management

- **Unit Tests**: Mock data, no database
- **Integration Tests**: MongoDB Memory Server (in-memory)
- **E2E Tests**: Test database or seeded data

### Coverage Goals

| Type | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| Target | 70% | 60% | 70% | 70% |
| Current | ✅ | ✅ | ✅ | ✅ |

---

## 🐛 Debugging

### Server-Side Debugging

#### Winston Logger
Structured logging with different levels:

```javascript
const logger = require('./utils/logger');

logger.info('User logged in', { userId: user._id });
logger.error('Database connection failed', { error: err.message });
logger.debug('Processing request', { method: req.method });
```

**Log Files:**
- `server/logs/error.log` - Error messages only
- `server/logs/combined.log` - All log messages

#### Morgan HTTP Logging
Logs all HTTP requests in development:
```
GET /api/posts 200 45ms
POST /api/auth/login 401 120ms
```

#### Node.js Debugger
```bash
# Debug with Chrome DevTools
node --inspect server/src/server.js

# Debug with breakpoint
node --inspect-brk server/src/server.js
```

Then open: `chrome://inspect`

### Client-Side Debugging

#### Error Boundaries
Catches React errors gracefully:
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### Browser DevTools
- **Console**: Log messages and errors
- **Network**: Monitor API requests
- **React DevTools**: Inspect component tree
- **Performance**: Profile render times

#### Debugging Tips
```javascript
// Group related logs
console.group('API Request');
console.log('URL:', url);
console.log('Method:', method);
console.groupEnd();

// Table view for arrays
console.table(users);

// Measure performance
console.time('fetchUsers');
await fetchUsers();
console.timeEnd('fetchUsers');
```

### Common Issues & Solutions

#### Port Already in Use
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### MongoDB Connection Error
```bash
# Check MongoDB status
mongod --version

# Start MongoDB
mongod
# or
brew services start mongodb-community
```

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Test Failures
```bash
# Clear Jest cache
npm test -- --clearCache

# Run specific test file
npm test -- Button.test.jsx

# Verbose output
npm test -- --verbose
```

---

## 📊 Code Coverage

### Viewing Coverage Reports

After running tests with coverage:
```bash
npm run test:coverage
```

Open the HTML report:
```bash
# macOS
open coverage/index.html

# Linux
xdg-open coverage/index.html

# Windows
start coverage/index.html
```

### Coverage Report Structure
```
coverage/
├── index.html          # Main coverage page
├── lcov-report/        # Detailed HTML reports
│   ├── index.html
│   └── ... (by file)
├── coverage.json       # Raw coverage data
└── lcov.info          # LCOV format
```

### Understanding Coverage Metrics

- **Statements**: % of statements executed
- **Branches**: % of if/else branches taken
- **Functions**: % of functions called
- **Lines**: % of lines executed

**Color Coding:**
- 🟢 Green: Good coverage (≥70%)
- 🟡 Yellow: Medium coverage (50-70%)
- 🔴 Red: Low coverage (<50%)

---

## 🎓 Project Highlights

### What Makes This Project Special

1. **Comprehensive Testing**: Unit, Integration, and E2E tests
2. **Professional Architecture**: Separation of concerns, MVC pattern
3. **Security Best Practices**: JWT auth, password hashing, input validation
4. **Error Handling**: Error boundaries, global error handlers, graceful failures
5. **Logging**: Structured logging with Winston, HTTP logging with Morgan
6. **Code Quality**: ESLint-ready, consistent code style
7. **Documentation**: Extensive README, testing guide, debugging guide
8. **Developer Experience**: Hot reload, clear error messages, helpful logs

### Learning Outcomes

✅ **Testing Strategies**: Understand different testing levels
✅ **Test-Driven Development**: Write tests before/with code
✅ **Debugging Techniques**: Use professional debugging tools
✅ **Error Handling**: Implement robust error handling
✅ **API Design**: RESTful API best practices
✅ **Authentication**: JWT-based auth implementation
✅ **Database Testing**: MongoDB Memory Server usage
✅ **E2E Testing**: Cypress for user flow testing

---

## 📚 Resources

### Official Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Cypress](https://docs.cypress.io/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Winston](https://github.com/winstonjs/winston)

### Additional Guides
- `TESTING_GUIDE.md` - Detailed testing documentation
- `DEBUGGING_GUIDE.md` - Debugging techniques and tools
- `SETUP_SUMMARY.md` - Complete setup walkthrough
- `Week6-Assignment.md` - Assignment requirements

### Tutorials & Articles
- [Testing JavaScript by Kent C. Dodds](https://testingjavascript.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Testing Tutorial](https://www.robinwieruch.de/react-testing-library/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards
- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure all tests pass before PR

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@MUNENE1212](https://github.com/MUNENE1212)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **PLP Academy** - For the comprehensive MERN stack curriculum
- **Jest Team** - For the excellent testing framework
- **Cypress Team** - For E2E testing tools
- **Open Source Community** - For amazing libraries and tools

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. Check the [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)
3. Review existing tests for examples
4. Open an issue in the repository

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Happy Testing! 🧪 Happy Debugging! 🐛**

Made with ❤️ for Week 6 Assignment

</div>
