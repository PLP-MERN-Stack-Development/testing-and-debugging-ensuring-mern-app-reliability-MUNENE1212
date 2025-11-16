// Unit tests for formatter utilities
import {
  formatDate,
  formatRelativeTime,
  truncateText,
  formatNumber,
  createSlug,
} from '../../utils/formatters';

describe('Formatter Utils - Unit Tests', () => {
  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);

      expect(formatted).toContain('2024');
      expect(formatted).toContain('January');
    });

    it('should handle string date input', () => {
      const formatted = formatDate('2024-01-15');

      expect(formatted).toContain('2024');
    });

    it('should return empty string for invalid input', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent dates', () => {
      const now = new Date();
      const result = formatRelativeTime(now);

      expect(result).toBe('just now');
    });

    it('should format minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo);

      expect(result).toContain('minute');
      expect(result).toContain('ago');
    });

    it('should format hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo);

      expect(result).toContain('hour');
      expect(result).toContain('ago');
    });

    it('should format days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysAgo);

      expect(result).toContain('day');
      expect(result).toContain('ago');
    });

    it('should return empty string for invalid input', () => {
      expect(formatRelativeTime(null)).toBe('');
      expect(formatRelativeTime(undefined)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);

      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 20);

      expect(result).toBe(shortText);
      expect(result).not.toContain('...');
    });

    it('should use default length of 100', () => {
      const text = 'a'.repeat(150);
      const result = truncateText(text);

      expect(result.length).toBe(103); // 100 + '...'
    });

    it('should handle edge cases', () => {
      expect(truncateText(null, 20)).toBeNull();
      expect(truncateText('', 20)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(1)).toBe('1');
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle non-number inputs', () => {
      expect(formatNumber('not a number')).toBe('0');
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });
  });

  describe('createSlug', () => {
    it('should create slug from text', () => {
      const text = 'Hello World Example';
      const result = createSlug(text);

      expect(result).toBe('hello-world-example');
    });

    it('should handle special characters', () => {
      const text = 'Hello! This is a @Test#123';
      const result = createSlug(text);

      expect(result).toBe('hello-this-is-a-test-123');
    });

    it('should remove leading/trailing dashes', () => {
      const text = '  Hello World  ';
      const result = createSlug(text);

      expect(result).not.toMatch(/^-/);
      expect(result).not.toMatch(/-$/);
    });

    it('should handle empty string', () => {
      expect(createSlug('')).toBe('');
      expect(createSlug(null)).toBe('');
      expect(createSlug(undefined)).toBe('');
    });
  });
});
