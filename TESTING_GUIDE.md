# Testing Guide

This guide explains the testing strategy and how to run tests for this MERN application.

## Table of Contents
- [Testing Strategy](#testing-strategy)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Debugging Tests](#debugging-tests)

## Testing Strategy

This project implements a comprehensive testing strategy covering:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test how different parts of the application work together
3. **End-to-End Tests**: Test complete user workflows

### Testing Tools

- **Jest**: JavaScript testing framework for unit and integration tests
- **React Testing Library**: Testing utilities for React components
- **Supertest**: HTTP assertions for API testing
- **MongoDB Memory Server**: In-memory MongoDB for testing
- **Cypress**: End-to-end testing framework

## Test Types

### Unit Tests

#### Server-Side
Located in: `server/tests/unit/`

Tests for:
- Authentication utilities (`auth.unit.test.js`)
- Validation functions
- Middleware functions
- Model methods

#### Client-Side
Located in: `client/src/tests/unit/`

Tests for:
- React components (`Button.test.jsx`)
- Custom hooks
- Utility functions (`validation.unit.test.jsx`, `formatters.unit.test.jsx`)

### Integration Tests

#### Server-Side
Located in: `server/tests/integration/`

Tests for:
- API endpoints (`auth.test.js`, `posts.test.js`)
- Database operations
- Authentication flows
- Complete request/response cycles

#### Client-Side
Located in: `client/src/tests/integration/`

Tests for:
- Hooks with API interactions (`useAuth.integration.test.jsx`)
- Component integration with state management
- Form submissions

### End-to-End Tests

Located in: `client/cypress/e2e/`

Tests for:
- Complete user flows (`auth.cy.js`)
- Navigation and routing (`app.cy.js`)
- Critical business processes

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### End-to-End Tests
```bash
# Start the development servers first
npm run dev

# In a new terminal, run E2E tests
npm run test:e2e

# For headless mode
cd client && npm run test:e2e:headless
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Writing Tests

### Unit Test Example

```javascript
// server/tests/unit/example.unit.test.js
describe('calculateTotal', () => {
  it('should add numbers correctly', () => {
    const result = calculateTotal(10, 20);
    expect(result).toBe(30);
  });

  it('should handle zero values', () => {
    const result = calculateTotal(0, 0);
    expect(result).toBe(0);
  });
});
```

### Integration Test Example

```javascript
// server/tests/integration/example.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.posts)).toBeTruthy();
  });
});
```

### E2E Test Example

```javascript
// client/cypress/e2e/example.cy.js
describe('User Login', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('test@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
  });
});
```

## Test Coverage

### Coverage Thresholds

The project requires minimum coverage of:
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

### Viewing Coverage Reports

After running tests with coverage:
```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser to view detailed coverage reports.

## Debugging Tests

### Debug Server Tests
```bash
node --inspect-brk node_modules/.bin/jest server/tests/unit/auth.unit.test.js --runInBand
```

### Debug Client Tests
```bash
node --inspect-brk node_modules/.bin/jest client/src/tests/unit/Button.test.jsx --runInBand
```

### Debug Cypress Tests
```bash
# Open Cypress Test Runner
cd client && npm run test:e2e

# Use the browser's DevTools for debugging
```

## Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Keep tests isolated** - Each test should be independent
3. **Use descriptive test names** - Explain what is being tested
4. **Test edge cases** - Not just the happy path
5. **Mock external dependencies** - Keep tests fast and reliable
6. **Clean up after tests** - Reset state between tests
7. **Maintain high coverage** - But focus on meaningful tests

## Common Issues

### Test Timeout
If tests are timing out, increase the timeout:
```javascript
jest.setTimeout(10000); // 10 seconds
```

### Database Connection Issues
Ensure MongoDB Memory Server is properly configured in test setup files.

### Port Conflicts
Make sure no other processes are using ports 3000 (client) or 5000 (server).

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
