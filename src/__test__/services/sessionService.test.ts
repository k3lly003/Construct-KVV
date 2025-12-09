import { sessionService } from '@/app/services/sessionService';
import api from '@/lib/axios';

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('SessionService', () => {
  const mockSessions = [
    {
      id: 'session-1',
      userAgent: 'Chrome on Windows',
      ipAddress: '192.168.1.1',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      current: true,
    },
    {
      id: 'session-2',
      userAgent: 'Firefox on Mac',
      ipAddress: '192.168.1.2',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      current: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getActive', () => {
    test('fetches active sessions successfully - array response', async () => {
      // Arrange
      mockedApi.get.mockResolvedValueOnce({
        data: mockSessions,
      } as any);

      // Act
      const result = await sessionService.getActive();

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith('/api/v1/sessions');
      expect(result).toEqual(mockSessions);
    });

    test('fetches active sessions successfully - data wrapper', async () => {
      // Arrange
      mockedApi.get.mockResolvedValueOnce({
        data: { data: mockSessions },
      } as any);

      // Act
      const result = await sessionService.getActive();

      // Assert
      expect(result).toEqual(mockSessions);
    });

    test('fetches active sessions successfully - sessions wrapper', async () => {
      // Arrange
      mockedApi.get.mockResolvedValueOnce({
        data: { sessions: mockSessions },
      } as any);

      // Act
      const result = await sessionService.getActive();

      // Assert
      expect(result).toEqual(mockSessions);
    });

    test('returns empty array for invalid response', async () => {
      // Arrange
      mockedApi.get.mockResolvedValueOnce({
        data: { invalid: 'data' },
      } as any);

      // Act
      const result = await sessionService.getActive();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('logoutCurrent', () => {
    test('logs out current session successfully', async () => {
      // Arrange
      mockedApi.post.mockResolvedValueOnce({
        data: { success: true },
      } as any);

      // Act
      const result = await sessionService.logoutCurrent();

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith('/api/v1/sessions/logout');
      expect(result).toBe(true);
    });

    test('returns true even when success is false', async () => {
      // Arrange
      mockedApi.post.mockResolvedValueOnce({
        data: { success: false },
      } as any);

      // Act
      const result = await sessionService.logoutCurrent();

      // Assert
      expect(result).toBe(true);
    });

    test('returns true when no success field', async () => {
      // Arrange
      mockedApi.post.mockResolvedValueOnce({
        data: {},
      } as any);

      // Act
      const result = await sessionService.logoutCurrent();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('logoutAll', () => {
    test('logs out all sessions successfully', async () => {
      // Arrange
      mockedApi.post.mockResolvedValueOnce({
        data: { success: true },
      } as any);

      // Act
      const result = await sessionService.logoutAll();

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith('/api/v1/sessions/logout-all');
      expect(result).toBe(true);
    });
  });

  describe('refresh', () => {
    test('refreshes token successfully - data.token', async () => {
      // Arrange
      const newToken = 'new-refreshed-token';
      mockedApi.post.mockResolvedValueOnce({
        data: { data: { token: newToken } },
      } as any);

      // Act
      const result = await sessionService.refresh();

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith('/api/v1/sessions/refresh');
      expect(result).toBe(newToken);
    });

    test('refreshes token successfully - direct token', async () => {
      // Arrange
      const newToken = 'new-refreshed-token';
      mockedApi.post.mockResolvedValueOnce({
        data: { token: newToken },
      } as any);

      // Act
      const result = await sessionService.refresh();

      // Assert
      expect(result).toBe(newToken);
    });

    test('returns null when no token in response', async () => {
      // Arrange
      mockedApi.post.mockResolvedValueOnce({
        data: {},
      } as any);

      // Act
      const result = await sessionService.refresh();

      // Assert
      expect(result).toBeNull();
    });
  });
});


