import { useState, useCallback } from 'react'
import { technicianService, TechnicianRegistrationData, TechnicianProfileData, TechnicianStatusUpdate, Technician } from '@/app/services/technicianService'

export const useTechnician = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const register = useCallback(async (data: TechnicianRegistrationData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await technicianService.register(data)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getCurrentProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await technicianService.getCurrentProfile()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: TechnicianProfileData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await technicianService.updateProfile(data)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTechnicianStatus = useCallback(async (id: string, status: TechnicianStatusUpdate) => {
    setLoading(true)
    setError(null)
    try {
      const result = await technicianService.updateTechnicianStatus(id, status)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update technician status'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    clearError,
    register,
    getCurrentProfile,
    updateProfile,
    updateTechnicianStatus,
  }
}
