// Unit tests for validation utilities
import {
  isValidEmail,
  validatePassword,
  validateUsername,
  sanitizeInput,
  validateRequiredFields,
} from '../../utils/validation';

describe('Validation Utils - Unit Tests', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid.email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
    });

    it('should reject empty or null inputs', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const result = validatePassword('Password123');

      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Password is strong');
    });

    it('should reject passwords shorter than 6 characters', () => {
      const result = validatePassword('Pass1');

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 6 characters');
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('PASSWORD123');

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('lowercase letter');
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('password123');

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('uppercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('Password');

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('number');
    });
  });

  describe('validateUsername', () => {
    it('should accept valid usernames', () => {
      expect(validateUsername('user123').isValid).toBe(true);
      expect(validateUsername('john_doe').isValid).toBe(true);
      expect(validateUsername('TestUser').isValid).toBe(true);
    });

    it('should reject usernames shorter than 3 characters', () => {
      const result = validateUsername('ab');

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 3 characters');
    });

    it('should reject usernames longer than 30 characters', () => {
      const result = validateUsername('a'.repeat(31));

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot exceed 30 characters');
    });

    it('should reject usernames with special characters', () => {
      const result = validateUsername('user@name');

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('letters, numbers, and underscores');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("XSS")</script>Hello';
      const result = sanitizeInput(input);

      expect(result).toBe('Hello');
      expect(result).not.toContain('<script>');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeInput(input);

      expect(result).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
    });
  });

  describe('validateRequiredFields', () => {
    it('should validate all required fields are present', () => {
      const fields = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = validateRequiredFields(fields);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for missing fields', () => {
      const fields = {
        username: '',
        email: 'test@example.com',
        password: '',
      };

      const result = validateRequiredFields(fields);

      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBeDefined();
      expect(result.errors.password).toBeDefined();
      expect(result.errors.email).toBeUndefined();
    });

    it('should handle empty object', () => {
      const result = validateRequiredFields({});

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
});
