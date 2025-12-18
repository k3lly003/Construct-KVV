import { render, screen, fireEvent, waitFor } from '../test-utils'
import OTPVerification from '@/app/(auth)/otp/page'

// Prepare jest fns we can assert on
const mockVerifyOtp = jest.fn(async () => true)
const mockResendOtp = jest.fn(async () => true)
const mockClearError = jest.fn()

// Mock useRouter to avoid navigation errors
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))

// Mock the useOtp hook to use our jest fns
jest.mock('@/app/hooks/useOtp', () => ({
  useOtp: () => ({
    isLoading: false,
    isResending: false,
    error: null,
    isVerified: false,
    verifyOtp: mockVerifyOtp,
    resendOtp: mockResendOtp,
    clearError: mockClearError,
    checkVerificationStatus: jest.fn()
  }),
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('OTPVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'user') {
        return JSON.stringify({ email: 'test@example.com', emailVerified: false })
      }
      return null
    })
  })

  it('renders OTP verification form', () => {
    render(<OTPVerification />)
    expect(screen.getByText('Check your email')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Verify Email')).toBeInTheDocument()
  })

  it('shows 6 OTP input boxes', () => {
    render(<OTPVerification />)
    const otpInputs = screen.getAllByRole('textbox')
    expect(otpInputs).toHaveLength(6)
  })

  it('auto-resends code on mount and resends on click', async () => {
    render(<OTPVerification />)
    // Auto background send once on mount
    await waitFor(() => expect(mockResendOtp).toHaveBeenCalledTimes(1))

    fireEvent.click(screen.getByText('Resend'))
    await waitFor(() => expect(mockResendOtp).toHaveBeenCalledTimes(2))
  })

  it('verifies when 6 digits are entered', async () => {
    render(<OTPVerification />)
    const boxes = screen.getAllByRole('textbox')
    const digits = ['1','2','3','4','5','6']
    digits.forEach((d, i) => {
      fireEvent.change(boxes[i], { target: { value: d } })
    })
    await waitFor(() =>
      expect(mockVerifyOtp).toHaveBeenCalledWith('test@example.com', '123456')
    )
  })
})