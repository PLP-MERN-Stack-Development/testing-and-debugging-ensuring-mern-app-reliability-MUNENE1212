// Custom Cypress Commands

/**
 * Custom command to login a user
 * @example cy.login('test@example.com', 'password123')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/auth/login',
    body: {
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');

    // Store token in localStorage
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

/**
 * Custom command to register a new user
 * @example cy.register('testuser', 'test@example.com', 'Password123')
 */
Cypress.Commands.add('register', (username, email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/auth/register',
    body: {
      username,
      email,
      password,
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 201) {
      window.localStorage.setItem('token', response.body.token);
      window.localStorage.setItem('user', JSON.stringify(response.body.user));
    }
    return response;
  });
});

/**
 * Custom command to logout
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
});

/**
 * Custom command to get auth token
 * @example cy.getAuthToken().then(token => {...})
 */
Cypress.Commands.add('getAuthToken', () => {
  return cy.window().then((window) => {
    return window.localStorage.getItem('token');
  });
});

/**
 * Custom command to create a post
 * @example cy.createPost({ title: 'Test', content: 'Content', category: 'id' })
 */
Cypress.Commands.add('createPost', (postData) => {
  cy.getAuthToken().then((token) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/posts',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: postData,
    });
  });
});
