// Server-side test setup file
// This file runs before each test suite

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';

// Increase test timeout for database operations
jest.setTimeout(10000);

// Global test utilities can be added here
global.testUtils = {
  // Helper function to create mock user data
  createMockUser: () => ({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  }),

  // Helper function to create mock post data
  createMockPost: (userId) => ({
    title: 'Test Post',
    content: 'This is test content',
    author: userId,
  }),

  // Helper function to create mock task data
  createMockTask: () => ({
    title: 'Test Task',
    description: 'This is a test task description',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    tags: ['test', 'sample'],
  }),
};

// Suppress console errors and warnings during tests (optional)
// Uncomment if you want cleaner test output
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };
