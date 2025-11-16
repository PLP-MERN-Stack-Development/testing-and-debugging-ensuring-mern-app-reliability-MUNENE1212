// Script to set up test database
require('dotenv').config();
const mongoose = require('mongoose');

const setupTestDb = async () => {
  try {
    const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/mern-testing-test';

    console.log('Connecting to test database...');
    await mongoose.connect(testDbUri);

    console.log('Connected to test database');
    console.log('Database name:', mongoose.connection.name);

    // Drop database to start fresh
    await mongoose.connection.dropDatabase();
    console.log('Test database cleared');

    await mongoose.connection.close();
    console.log('Test database setup complete');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
};

setupTestDb();
