import { useState, useCallback } from 'react'
import { architectService, ArchitectRegistrationData, ArchitectProfileData, ArchitectStatusUpdate, Architect, CreateDesignRequestDTO, Portfolio } from '@/app/services/architectService'

export const useArchitect = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const register = useCallback(async (data: ArchitectRegistrationData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await architectService.register(data)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getApprovedArchitects = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await architectService.getApprovedArchitects()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch architects'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getArchitectById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await architectService.getArchitectById(id)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch architect'
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
      const result = await architectService.getCurrentProfile()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: ArchitectProfileData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await architectService.updateProfile(data)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getAllArchitects = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await architectService.getAllArchitects()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch all architects'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getPendingArchitects = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await architectService.getPendingArchitects()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch pending architects'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateArchitectStatus = useCallback(async (id: string, status: ArchitectStatusUpdate) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await architectService.updateArchitectStatus(id, status)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update architect status'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getArchitectPortfolios = useCallback(async (architectId: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await architectService.getArchitectPortfolios(architectId)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch portfolios'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getProfessionalPortfolios = useCallback(async (professionalType: 'architect' | 'contractor' | 'technician' | 'seller', professionalId: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await architectService.getProfessionalPortfolios(professionalType, professionalId)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch professional portfolios'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createDesignrequest = useCallback(async ( data: CreateDesignRequestDTO) => {
    setLoading(true)
    setError(null)
    try {
      const result = await architectService.createDesignRequest( data)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create design request'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getDesignRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await architectService.getDesignRequests()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch design requests'
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
    getApprovedArchitects,
    getArchitectById,
    getCurrentProfile,
    updateProfile,
    getAllArchitects,
    getPendingArchitects,
    updateArchitectStatus,
    getArchitectPortfolios,
    getProfessionalPortfolios,
    createDesignrequest,
    getDesignRequests
  }
}


