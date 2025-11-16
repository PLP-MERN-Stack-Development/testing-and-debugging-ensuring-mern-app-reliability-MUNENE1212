// E2E tests for basic app functionality

describe('App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application', () => {
    cy.contains('MERN Testing & Debugging').should('be.visible');
  });

  it('should display the header', () => {
    cy.get('.app-header').should('be.visible');
    cy.get('.app-header h1').should('contain', 'MERN Testing');
  });

  it('should display features section', () => {
    cy.contains('Features Implemented').should('be.visible');
    cy.contains('Unit Testing').should('be.visible');
    cy.contains('Integration Testing').should('be.visible');
    cy.contains('End-to-End Testing').should('be.visible');
  });

  it('should display test commands section', () => {
    cy.contains('Running Tests').should('be.visible');
    cy.contains('npm test').should('be.visible');
    cy.contains('npm run test:unit').should('be.visible');
    cy.contains('npm run test:integration').should('be.visible');
    cy.contains('npm run test:e2e').should('be.visible');
  });

  it('should have proper styling', () => {
    cy.get('.app').should('have.css', 'min-height');
    cy.get('.app-header').should('be.visible');
    cy.get('.feature-section').should('be.visible');
  });
});
