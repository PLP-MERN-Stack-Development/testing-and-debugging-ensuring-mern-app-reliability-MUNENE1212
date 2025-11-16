// Cypress E2E Support File
// This file is processed and loaded automatically before your test files.

// Import commands
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in command log (optional)
const app = window.top;

if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Global before hook
beforeEach(() => {
  // Clear localStorage and sessionStorage before each test
  cy.clearLocalStorage();
  cy.clearCookies();
});
