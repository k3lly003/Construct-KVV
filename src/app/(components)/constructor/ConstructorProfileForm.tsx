"use client"

import { useState, useEffect } from 'react'
import { useConstructor } from '@/app/hooks/useConstructor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, X, Save, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConstructorProfileData } from '@/app/services/constructorService'

interface LocationInput {
  value: string
  id: string
}

interface DocumentInput {
  value: string
  id: string
}

export default function ConstructorProfileForm() {
  const { t } = useTranslation()
  const { 
    getCurrentProfile, 
    updateProfile, 
    currentContractor, 
    loading, 
    error, 
    clearError 
  } = useConstructor()
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    taxId: '',
    yearsExperience: '',
    licenseNumber: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    payoutType: '',
    payoutAccountNumber: ''
  })

  const [locations, setLocations] = useState<LocationInput[]>([
    { value: '', id: '1' }
  ])

  const [documents, setDocuments] = useState<DocumentInput[]>([
    { value: '', id: '1' }
  ])

  // Load current profile data
  useEffect(() => {
    getCurrentProfile()
  }, [getCurrentProfile])

  // Update form when profile data is loaded
  useEffect(() => {
    if (currentContractor) {
      setFormData({
        businessName: currentContractor.businessName || '',
        businessAddress: currentContractor.businessAddress || '',
        businessPhone: currentContractor.businessPhone || '',
        taxId: currentContractor.taxId || '',
        yearsExperience: currentContractor.yearsExperience?.toString() || '',
        licenseNumber: currentContractor.licenseNumber || '',
        insuranceProvider: currentContractor.insuranceInfo?.provider || '',
        insurancePolicyNumber: currentContractor.insuranceInfo?.policyNumber || '',
        payoutType: currentContractor.payoutMethod?.type || '',
        payoutAccountNumber: currentContractor.payoutMethod?.accountNumber || ''
      })

      // Set locations
      if (currentContractor.location && currentContractor.location.length > 0) {
        setLocations(
          currentContractor.location.map((loc, index) => ({
            value: loc,
            id: (index + 1).toString()
          }))
        )
      }

      // Set documents
      if (currentContractor.documents && currentContractor.documents.length > 0) {
        setDocuments(
          currentContractor.documents.map((doc, index) => ({
            value: doc,
            id: (index + 1).toString()
          }))
        )
      }
    }
  }, [currentContractor])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addLocation = () => {
    const newId = (locations.length + 1).toString()
    setLocations(prev => [...prev, { value: '', id: newId }])
  }

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      setLocations(prev => prev.filter(loc => loc.id !== id))
    }
  }

  const updateLocation = (id: string, value: string) => {
    setLocations(prev => 
      prev.map(loc => loc.id === id ? { ...loc, value } : loc)
    )
  }

  const addDocument = () => {
    const newId = (documents.length + 1).toString()
    setDocuments(prev => [...prev, { value: '', id: newId }])
  }

  const removeDocument = (id: string) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter(doc => doc.id !== id))
    }
  }

  const updateDocument = (id: string, value: string) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === id ? { ...doc, value } : doc)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Filter out empty locations and documents
    const validLocations = locations.filter(loc => loc.value.trim()).map(loc => loc.value.trim())
    const validDocuments = documents.filter(doc => doc.value.trim()).map(doc => doc.value.trim())

    const profileData: ConstructorProfileData = {
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessPhone: formData.businessPhone,
      taxId: formData.taxId,
      location: validLocations,
      yearsExperience: parseInt(formData.yearsExperience) || 0,
      licenseNumber: formData.licenseNumber,
      insuranceInfo: {
        provider: formData.insuranceProvider,
        policyNumber: formData.insurancePolicyNumber
      },
      documents: validDocuments
    }

    // Add payout method if provided
    if (formData.payoutType && formData.payoutAccountNumber) {
      profileData.payoutMethod = {
        type: formData.payoutType,
        accountNumber: formData.payoutAccountNumber
      }
    }

    try {
      await updateProfile(profileData)
    } catch (err) {
      // Error is handled by the hook
    }
  }

  if (!currentContractor && !loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {t('constructor.profile.noProfile', 'No profile found. Please register first.')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t('constructor.profile.title', 'Constructor Profile')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('constructor.profile.subtitle', 'Update your business information and credentials')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                {t('constructor.profile.businessInfo', 'Business Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">{t('constructor.profile.businessName', 'Business Name')}</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessPhone">{t('constructor.profile.businessPhone', 'Business Phone')}</Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="businessAddress">{t('constructor.profile.businessAddress', 'Business Address')}</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">{t('constructor.profile.taxId', 'Tax ID')}</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="yearsExperience">{t('constructor.profile.yearsExperience', 'Years of Experience')}</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="licenseNumber">{t('constructor.profile.licenseNumber', 'License Number')}</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('constructor.profile.location', 'Service Locations')}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLocation}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('constructor.profile.addLocation', 'Add Location')}
                </Button>
              </div>
              
              {locations.map((location) => (
                <div key={location.id} className="flex gap-2">
                  <Input
                    value={location.value}
                    onChange={(e) => updateLocation(location.id, e.target.value)}
                    placeholder={t('constructor.profile.locationPlaceholder', 'e.g., Kigali City, Gasabo')}
                  />
                  {locations.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLocation(location.id)}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Insurance Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                {t('constructor.profile.insuranceInfo', 'Insurance Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insuranceProvider">{t('constructor.profile.insuranceProvider', 'Insurance Provider')}</Label>
                  <Input
                    id="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="insurancePolicyNumber">{t('constructor.profile.insurancePolicyNumber', 'Policy Number')}</Label>
                  <Input
                    id="insurancePolicyNumber"
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payout Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                {t('constructor.profile.payoutMethod', 'Payout Method')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payoutType">{t('constructor.profile.payoutType', 'Payout Type')}</Label>
                  <Input
                    id="payoutType"
                    value={formData.payoutType}
                    onChange={(e) => handleInputChange('payoutType', e.target.value)}
                    placeholder="bank, mobile money, etc."
                  />
                </div>
                
                <div>
                  <Label htmlFor="payoutAccountNumber">{t('constructor.profile.payoutAccountNumber', 'Account Number')}</Label>
                  <Input
                    id="payoutAccountNumber"
                    value={formData.payoutAccountNumber}
                    onChange={(e) => handleInputChange('payoutAccountNumber', e.target.value)}
                    placeholder="Account number or phone number"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('constructor.profile.documents', 'Documents')}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDocument}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('constructor.profile.addDocument', 'Add Document')}
                </Button>
              </div>
              
              {documents.map((document) => (
                <div key={document.id} className="flex gap-2">
                  <Input
                    value={document.value}
                    onChange={(e) => updateDocument(document.id, e.target.value)}
                    placeholder={t('constructor.profile.documentPlaceholder', 'Document URL or file path')}
                  />
                  {documents.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDocument(document.id)}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('constructor.profile.updating', 'Updating...')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {t('constructor.profile.updateProfile', 'Update Profile')}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
