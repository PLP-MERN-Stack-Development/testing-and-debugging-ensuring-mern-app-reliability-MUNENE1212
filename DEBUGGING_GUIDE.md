# Debugging Guide

This guide covers debugging techniques and tools implemented in this MERN application.

## Table of Contents
- [Debugging Tools](#debugging-tools)
- [Server-Side Debugging](#server-side-debugging)
- [Client-Side Debugging](#client-side-debugging)
- [Common Issues](#common-issues)
- [Performance Debugging](#performance-debugging)

## Debugging Tools

### Implemented in This Project

1. **Winston Logger** - Server-side logging
2. **Error Boundaries** - React error handling
3. **Global Error Handler** - Express error handling
4. **Morgan** - HTTP request logging
5. **Browser DevTools** - Client-side debugging

## Server-Side Debugging

### Logging with Winston

The application uses Winston for structured logging.

#### Log Levels
- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages (default)
- `debug`: Debug messages

#### Using the Logger

```javascript
const logger = require('./utils/logger');

// Info level
logger.info('User logged in', { userId: user._id });

// Error level
logger.error('Database connection failed', { error: error.message });

// Debug level
logger.debug('Processing request', { method: req.method, path: req.path });
```

#### Log Files

Logs are stored in:
- `server/logs/error.log` - Error logs only
- `server/logs/combined.log` - All logs

### Global Error Handler

All Express errors are caught and logged:

```javascript
// Usage in controllers
const { AppError } = require('../middleware/errorHandler');

if (!user) {
  throw new AppError('User not found', 404);
}
```

### Debugging Node.js Code

#### Using Node Inspector

```bash
# Debug server
node --inspect server/src/server.js

# Debug with break on start
node --inspect-brk server/src/server.js
```

Then open Chrome DevTools at `chrome://inspect`

#### Using VS Code Debugger

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/src/server.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### HTTP Request Logging

Morgan logs all HTTP requests in development:

```
GET /api/posts 200 45ms
POST /api/auth/login 401 120ms
```

## Client-Side Debugging

### Error Boundaries

The application uses Error Boundaries to catch React errors:

```jsx
// Usage
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

Error boundaries catch:
- Rendering errors
- Lifecycle method errors
- Constructor errors

### Browser DevTools

#### Console Logging

```javascript
// Basic logging
console.log('User data:', user);

// Group logs
console.group('API Request');
console.log('URL:', url);
console.log('Method:', method);
console.groupEnd();

// Tables for arrays
console.table(users);
```

#### React DevTools

Install React DevTools extension to:
- Inspect component tree
- View props and state
- Track component updates
- Profile performance

#### Network Debugging

Use Network tab to:
- Monitor API requests
- Check request/response headers
- View response data
- Analyze load times

### Redux DevTools (if using Redux)

Install Redux DevTools extension to:
- Track state changes
- Time-travel debugging
- Inspect dispatched actions

## Common Issues

### Database Connection Errors

```javascript
// Check connection
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});
```

### Authentication Issues

```javascript
// Debug token issues
const { verifyToken } = require('./utils/auth');

try {
  const decoded = verifyToken(token);
  logger.debug('Token verified', { userId: decoded.id });
} catch (error) {
  logger.error('Token verification failed', { error: error.message });
}
```

### CORS Errors

Check server configuration:

```javascript
// server/src/app.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## Performance Debugging

### Server Performance

#### Request Duration Logging

```javascript
// Middleware to log request duration
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.path} - ${duration}ms`);
  });

  next();
});
```

#### Database Query Performance

```javascript
// Enable MongoDB query logging
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.debug('MongoDB Query', {
    collection: collectionName,
    method: method,
    query: query,
  });
});
```

### Client Performance

#### React Profiler

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, phase, actualDuration, baseDuration, startTime, commitTime
) {
  console.log(`${id}'s ${phase} phase:`, actualDuration);
}

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

#### Performance API

```javascript
// Measure page load time
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart);
});
```

## Environment-Specific Debugging

### Development
- Verbose logging enabled
- Error stack traces shown
- Source maps available

### Production
- Minimal logging
- Generic error messages
- No sensitive data in logs

### Test
- Logs suppressed
- Mock external services
- Isolated environment

## Debugging Checklist

When encountering an issue:

1. **Check logs** - Review error and combined logs
2. **Verify environment variables** - Ensure all required vars are set
3. **Test database connection** - Confirm MongoDB is running
4. **Check network requests** - Use browser DevTools
5. **Review error messages** - Read the full stack trace
6. **Isolate the problem** - Reproduce in minimal example
7. **Add logging** - Insert strategic log statements
8. **Use debugger** - Set breakpoints and step through code

## Debugging Tools Quick Reference

| Tool | Purpose | Location |
|------|---------|----------|
| Winston | Server logging | `server/src/utils/logger.js` |
| Morgan | HTTP logging | `server/src/app.js` |
| Error Boundary | React errors | `client/src/components/ErrorBoundary.jsx` |
| Global Error Handler | Express errors | `server/src/middleware/errorHandler.js` |
| Chrome DevTools | Client debugging | Browser |
| Node Inspector | Server debugging | Chrome |

## Additional Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
