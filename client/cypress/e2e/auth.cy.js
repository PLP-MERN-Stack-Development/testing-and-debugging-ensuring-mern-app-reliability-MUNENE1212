// E2E tests for authentication flows
// Note: These tests require the backend server to be running

describe('Authentication E2E Tests', () => {
  const testUser = {
    username: 'cypresstest',
    email: `cypress${Date.now()}@example.com`,
    password: 'Password123',
  };

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe('User Registration Flow', () => {
    it('should register a new user', () => {
      cy.register(testUser.username, testUser.email, testUser.password)
        .then((response) => {
          expect(response.status).to.be.oneOf([201, 400]); // 400 if user exists
          if (response.status === 201) {
            expect(response.body).to.have.property('token');
            expect(response.body).to.have.property('user');
            expect(response.body.user.email).to.eq(testUser.email);
          }
        });
    });

    it('should not register user with invalid email', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/register',
        body: {
          username: 'testuser',
          email: 'invalid-email',
          password: 'Password123',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });

    it('should not register user with weak password', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/register',
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'weak',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('User Login Flow', () => {
    before(() => {
      // Register a user for login tests
      cy.register('logintest', 'logintest@example.com', 'Password123');
    });

    it('should login with correct credentials', () => {
      cy.login('logintest@example.com', 'Password123');

      cy.window().then((window) => {
        const token = window.localStorage.getItem('token');
        expect(token).to.exist;
      });
    });

    it('should not login with incorrect password', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        body: {
          email: 'logintest@example.com',
          password: 'WrongPassword123',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('error');
      });
    });

    it('should not login with non-existent email', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        body: {
          email: 'nonexistent@example.com',
          password: 'Password123',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('User Logout Flow', () => {
    beforeEach(() => {
      cy.login('logintest@example.com', 'Password123');
    });

    it('should logout successfully', () => {
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.exist;
      });

      cy.logout();

      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.be.null;
        expect(window.localStorage.getItem('user')).to.be.null;
      });
    });
  });

  describe('Protected Routes', () => {
    it('should access user profile when authenticated', () => {
      cy.login('logintest@example.com', 'Password123');

      cy.getAuthToken().then((token) => {
        cy.request({
          method: 'GET',
          url: 'http://localhost:5000/api/auth/me',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('user');
        });
      });
    });

    it('should not access protected route without authentication', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/auth/me',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
