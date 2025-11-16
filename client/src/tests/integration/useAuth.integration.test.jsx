// Integration tests for useAuth hook
import { renderHook, act, waitFor } from '@testing-library/react';
import useAuth from '../../hooks/useAuth';

// Mock fetch API
global.fetch = jest.fn();

describe('useAuth Hook - Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          _id: '123',
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      expect(result.current.user).toEqual(mockResponse.user);
      expect(result.current.token).toBe(mockResponse.token);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
    });

    it('should handle login failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          _id: '123',
          username: 'newuser',
          email: 'new@example.com',
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.register('newuser', 'new@example.com', 'Password123');
      });

      expect(result.current.user).toEqual(mockResponse.user);
      expect(result.current.token).toBe(mockResponse.token);
    });
  });

  describe('logout', () => {
    it('should logout and clear storage', async () => {
      // Setup: login first
      const mockResponse = {
        token: 'mock-jwt-token',
        user: { _id: '123', username: 'testuser', email: 'test@example.com' },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Now logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: { _id: '123', username: 'testuser', email: 'test@example.com' },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not logged in', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated()).toBe(false);
    });
  });
});
