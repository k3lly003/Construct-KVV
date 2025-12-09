import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render as customRender } from '../test-uitls';
import Page from '@/app/(auth)/signin/page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@/app/hooks/useSession', () => ({
  useSession: () => ({
    refresh: jest.fn().mockResolvedValue('mock-token'),
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Email validation', () => {
    test('shows error for invalid email format', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    test('shows error for empty email', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<Page />);

      // Act
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password validation', () => {
    test('shows error for password less than 8 characters', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'short');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    test('shows error for empty password', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Authentication flow', () => {
    test('stores JWT token in localStorage on successful login', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockToken = 'mock-jwt-token';
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            token: mockToken,
            user: mockUser,
          },
        }),
      });

      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('authToken', mockToken);
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      });
    });

    test('handles authentication errors', async () => {
      // Arrange
      const user = userEvent.setup();
      const errorMessage = 'Invalid credentials';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: errorMessage,
        }),
      });

      const { toast } = require('sonner');
      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    test('handles network errors gracefully', async () => {
      // Arrange
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { toast } = require('sonner');
      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Password visibility toggle', () => {
    test('toggles password visibility when eye icon is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<Page />);

      // Act
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      await user.type(passwordInput, 'password123');

      // Find and click the eye icon (password visibility toggle)
      const toggleButton = passwordInput.parentElement?.querySelector('[class*="cursor-pointer"]');
      if (toggleButton) {
        await user.click(toggleButton);
      }

      // Assert
      await waitFor(() => {
        expect(passwordInput.type).toBe('text');
      });
    });
  });

  describe('Form submission', () => {
    test('prevents submission with invalid data', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    test('shows loading state during submission', async () => {
      // Arrange
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    data: { token: 'token', user: {} },
                  }),
                }),
              100
            )
          )
      );

      customRender(<Page />);

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Assert
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });
});


