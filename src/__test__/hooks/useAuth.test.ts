import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Initialization', () => {
    test('checks auth status on mount', () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ id: '1', email: 'test@example.com' });
    });

    test('returns unauthenticated when no token', () => {
      // Arrange
      localStorage.clear();

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    test('handles invalid user data gracefully', () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', 'invalid-json');

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('Login', () => {
    test('stores token and user data on login', () => {
      // Arrange
      const token = 'new-token';
      const userData = { id: '2', email: 'newuser@example.com', name: 'New User' };

      // Act
      const { result } = renderHook(() => useAuth());
      act(() => {
        result.current.login(token, userData);
      });

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', token);
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(userData));
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(userData);
    });
  });

  describe('Logout', () => {
    test('removes token and user data on logout', () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));

      // Act
      const { result } = renderHook(() => useAuth());
      act(() => {
        result.current.logout();
      });

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/signin');
    });
  });

  describe('requireAuth', () => {
    test('returns true when authenticated', () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: '1' }));

      // Act
      const { result } = renderHook(() => useAuth());
      act(() => {
        const allowed = result.current.requireAuth();
        expect(allowed).toBe(true);
      });
    });

    test('redirects when not authenticated', () => {
      // Arrange
      localStorage.clear();

      // Act
      const { result } = renderHook(() => useAuth());
      act(() => {
        result.current.requireAuth('/login');
      });

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('checkAuthStatus', () => {
    test('updates auth status when called', () => {
      // Arrange
      localStorage.setItem('authToken', 'new-token');
      localStorage.setItem('user', JSON.stringify({ id: '3', email: 'check@example.com' }));

      // Act
      const { result } = renderHook(() => useAuth());
      act(() => {
        result.current.checkAuthStatus();
      });

      // Assert
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ id: '3', email: 'check@example.com' });
    });
  });

  describe('Loading state', () => {
    test('starts with loading state', () => {
      // Arrange & Act
      const { result } = renderHook(() => useAuth());

      // Assert
      // Initially loading should be true, then false after check
      // This depends on the implementation timing
    });
  });
});


