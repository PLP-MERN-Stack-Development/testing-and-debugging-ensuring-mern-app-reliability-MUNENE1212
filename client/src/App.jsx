// Main App Component
import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <main className="app-main">
          <TaskList />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
