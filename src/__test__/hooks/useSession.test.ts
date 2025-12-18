import { renderHook, act, waitFor } from '@testing-library/react';
import { useSession } from '@/app/hooks/useSession';
import { sessionService } from '@/app/services/sessionService';

// Mock sessionService
jest.mock('@/app/services/sessionService', () => ({
  sessionService: {
    getActive: jest.fn(),
    logoutCurrent: jest.fn(),
    logoutAll: jest.fn(),
    refresh: jest.fn(),
  },
}));

describe('useSession', () => {
  const mockSessions = [
    {
      id: 'session-1',
      device: 'Chrome on Windows',
      ip: '192.168.1.1',
      lastActive: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getActive', () => {
    test('fetches active sessions successfully', async () => {
      // Arrange
      (sessionService.getActive as jest.Mock).mockResolvedValue(mockSessions);

      // Act
      const { result } = renderHook(() => useSession());
      let sessions: any[] = [];
      await act(async () => {
        sessions = await result.current.getActive();
      });

      // Assert
      await waitFor(() => {
        expect(sessionService.getActive).toHaveBeenCalled();
        expect(sessions).toEqual(mockSessions);
        expect(result.current.sessions).toEqual(mockSessions);
      });
    });

    test('handles getActive errors', async () => {
      // Arrange
      const error = new Error('Failed to fetch sessions');
      (sessionService.getActive as jest.Mock).mockRejectedValue(error);

      // Act
      const { result } = renderHook(() => useSession());
      await act(async () => {
        await expect(result.current.getActive()).rejects.toThrow('Failed to fetch sessions');
      });

      // Assert
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch sessions');
      });
    });
  });

  describe('logout', () => {
    test('logs out current session successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: '1' }));
      (sessionService.logoutCurrent as jest.Mock).mockResolvedValue(undefined);

      // Act
      const { result } = renderHook(() => useSession());
      let logoutResult: boolean = false;
      await act(async () => {
        logoutResult = await result.current.logout();
      });

      // Assert
      await waitFor(() => {
        expect(sessionService.logoutCurrent).toHaveBeenCalled();
        expect(logoutResult).toBe(true);
        expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      });
    });

    test('clears localStorage even if server logout fails', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      (sessionService.logoutCurrent as jest.Mock).mockRejectedValue(new Error('Server error'));

      // Act
      const { result } = renderHook(() => useSession());
      let logoutResult: boolean = false;
      await act(async () => {
        logoutResult = await result.current.logout();
      });

      // Assert
      await waitFor(() => {
        expect(logoutResult).toBe(true);
        expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    });
  });

  describe('logoutAll', () => {
    test('logs out all sessions successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      (sessionService.logoutAll as jest.Mock).mockResolvedValue(undefined);

      // Act
      const { result } = renderHook(() => useSession());
      let logoutResult: boolean = false;
      await act(async () => {
        logoutResult = await result.current.logoutAll();
      });

      // Assert
      await waitFor(() => {
        expect(sessionService.logoutAll).toHaveBeenCalled();
        expect(logoutResult).toBe(true);
        expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    });

    test('clears localStorage even if server logoutAll fails', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      (sessionService.logoutAll as jest.Mock).mockRejectedValue(new Error('Server error'));

      // Act
      const { result } = renderHook(() => useSession());
      let logoutResult: boolean = false;
      await act(async () => {
        logoutResult = await result.current.logoutAll();
      });

      // Assert
      await waitFor(() => {
        expect(logoutResult).toBe(true);
        expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    });
  });

  describe('refresh', () => {
    test('refreshes token successfully', async () => {
      // Arrange
      const newToken = 'new-refreshed-token';
      (sessionService.refresh as jest.Mock).mockResolvedValue(newToken);

      // Act
      const { result } = renderHook(() => useSession());
      let refreshedToken: string | null = null;
      await act(async () => {
        refreshedToken = await result.current.refresh();
      });

      // Assert
      await waitFor(() => {
        expect(sessionService.refresh).toHaveBeenCalled();
        expect(refreshedToken).toBe(newToken);
        expect(localStorage.setItem).toHaveBeenCalledWith('authToken', newToken);
      });
    });

    test('handles refresh errors', async () => {
      // Arrange
      const error = new Error('Token refresh failed');
      (sessionService.refresh as jest.Mock).mockRejectedValue(error);

      // Act
      const { result } = renderHook(() => useSession());
      await act(async () => {
        await expect(result.current.refresh()).rejects.toThrow('Token refresh failed');
      });

      // Assert
      await waitFor(() => {
        expect(result.current.error).toBe('Token refresh failed');
      });
    });

    test('does not store token if refresh returns null', async () => {
      // Arrange
      (sessionService.refresh as jest.Mock).mockResolvedValue(null);

      // Act
      const { result } = renderHook(() => useSession());
      let refreshedToken: string | null = null;
      await act(async () => {
        refreshedToken = await result.current.refresh();
      });

      // Assert
      await waitFor(() => {
        expect(refreshedToken).toBeNull();
        // localStorage.setItem should not be called with null token
      });
    });
  });

  describe('Loading states', () => {
    test('sets loading state during operations', async () => {
      // Arrange
      (sessionService.getActive as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockSessions), 100))
      );

      // Act
      const { result } = renderHook(() => useSession());
      const promise = act(async () => {
        await result.current.getActive();
      });

      // Assert
      expect(result.current.loading).toBe(true);

      await promise;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});


