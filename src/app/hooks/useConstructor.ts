import { useState, useCallback } from 'react'
import { constructorService, ConstructorRegistrationData, ConstructorProfileData, ConstructorStatusUpdate, Constructor } from '@/app/services/constructorService'

interface UseConstructorReturn {
  // State
  contractors: Constructor[]
  currentContractor: Constructor | null
  loading: boolean
  error: string | null
  
  // Actions
  register: (data: ConstructorRegistrationData) => Promise<void>
  getApprovedContractors: () => Promise<void>
  getContractorById: (id: string) => Promise<void>
  getCurrentProfile: () => Promise<void>
  updateProfile: (data: ConstructorProfileData) => Promise<void>
  getAllContractors: () => Promise<void>
  getPendingContractors: () => Promise<void>
  updateContractorStatus: (id: string, status: ConstructorStatusUpdate) => Promise<void>
  
  // Utility
  clearError: () => void
  resetState: () => void
}

export const useConstructor = (): UseConstructorReturn => {
  const [contractors, setContractors] = useState<Constructor[]>([])
  const [currentContractor, setCurrentContractor] = useState<Constructor | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const resetState = useCallback(() => {
    setContractors([])
    setCurrentContractor(null)
    setLoading(false)
    setError(null)
  }, [])

  const register = useCallback(async (data: ConstructorRegistrationData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.register(data)
      setCurrentContractor(result.constructor)
      // Optionally add to contractors list if needed
      setContractors(prev => [...prev, result.constructor])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getApprovedContractors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.getApprovedContractors()
      setContractors(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch approved contractors')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getContractorById = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.getContractorById(id)
      setCurrentContractor(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contractor')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getCurrentProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.getCurrentProfile()
      // Extract the data from the response and convert TechnicianData to Constructor
      if (result.success && result.data) {
        // Convert TechnicianData to Constructor format
        const constructorData: Constructor = {
          id: result.data.id,
          email: result.data.user.email,
          firstName: result.data.user.firstName,
          lastName: result.data.user.lastName,
          phone: result.data.user.phone,
          businessName: '', // Not available in TechnicianData
          businessAddress: '', // Not available in TechnicianData
          businessPhone: '', // Not available in TechnicianData
          taxId: '', // Not available in TechnicianData
          location: result.data.location,
          yearsExperience: result.data.experience,
          licenseNumber: '', // Not available in TechnicianData
          insuranceInfo: {
            provider: '', // Not available in TechnicianData
            policyNumber: '' // Not available in TechnicianData
          },
          documents: result.data.documents,
          status: result.data.status,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
          payoutMethod: result.data.payoutMethod
        }
        setCurrentContractor(constructorData)
      } else {
        setCurrentContractor(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: ConstructorProfileData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.updateProfile(data)
      setCurrentContractor(result.constructor)
      // Update in contractors list if it exists
      setContractors(prev => 
        prev.map(contractor => 
          contractor.id === result.constructor.id ? result.constructor : contractor
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getAllContractors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.getAllContractors()
      setContractors(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch all contractors')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getPendingContractors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.getPendingContractors()
      setContractors(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending contractors')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateContractorStatus = useCallback(async (id: string, status: ConstructorStatusUpdate) => {
    try {
      setLoading(true)
      setError(null)
      const result = await constructorService.updateContractorStatus(id, status)
      // Update in contractors list
      setContractors(prev => 
        prev.map(contractor => 
          contractor.id === id ? result.constructor : contractor
        )
      )
      // Update current contractor if it's the same one
      if (currentContractor?.id === id) {
        setCurrentContractor(result.constructor)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contractor status')
      throw err
    } finally {
      setLoading(false)
    }
  }, [currentContractor?.id])

  return {
    // State
    contractors,
    currentContractor,
    loading,
    error,
    
    // Actions
    register,
    getApprovedContractors,
    getContractorById,
    getCurrentProfile,
    updateProfile,
    getAllContractors,
    getPendingContractors,
    updateContractorStatus,
    
    // Utility
    clearError,
    resetState
  }
}
