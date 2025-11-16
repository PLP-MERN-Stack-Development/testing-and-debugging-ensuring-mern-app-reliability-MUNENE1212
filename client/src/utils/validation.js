// Client-side validation utilities

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return {
    isValid: true,
    message: 'Password is strong',
  };
};

/**
 * Validate username
 * @param {string} username
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateUsername = (username) => {
  if (!username || username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long',
    };
  }

  if (username.length > 30) {
    return {
      isValid: false,
      message: 'Username cannot exceed 30 characters',
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, and underscores',
    };
  }

  return {
    isValid: true,
    message: 'Username is valid',
  };
};

/**
 * Sanitize input string
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';

  // Remove HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim();
};

/**
 * Validate required fields
 * @param {Object} fields - Object with field names as keys and values
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateRequiredFields = (fields) => {
  const errors = {};
  let isValid = true;

  Object.entries(fields).forEach(([key, value]) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      isValid = false;
    }
  });

  return { isValid, errors };
};
