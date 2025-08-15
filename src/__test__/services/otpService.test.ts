import { otpService } from '@/app/services/otpService'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('OtpService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('verifyOtp', () => {
    it('should verify OTP successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'OTP verified successfully'
        }
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await otpService.verifyOtp({
        email: 'test@example.com',
        otp: '123456'
      })

      expect(result).toEqual(mockResponse.data)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/verify'),
        { email: 'test@example.com', otp: '123456' },
        expect.any(Object)
      )
    })

    it('should handle verification errors', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Invalid OTP' }
        }
      })

      await expect(
        otpService.verifyOtp({
          email: 'test@example.com',
          otp: '123456'
        })
      ).rejects.toThrow(/Invalid OTP|Invalid OTP or email/)
    })
  })
})