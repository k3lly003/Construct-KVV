"use client"

import { useState } from 'react'
import { useConstructor } from '@/app/hooks/useConstructor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, X, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LocationInput {
  value: string
  id: string
}

interface DocumentInput {
  value: string
  id: string
}

export default function ConstructorRegistrationForm() {
  const { t } = useTranslation()
  const { register, loading, error, clearError } = useConstructor()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    taxId: '',
    yearsExperience: '',
    licenseNumber: '',
    insuranceProvider: '',
    insurancePolicyNumber: ''
  })

  const [locations, setLocations] = useState<LocationInput[]>([
    { value: '', id: '1' }
  ])

  const [documents, setDocuments] = useState<DocumentInput[]>([
    { value: '', id: '1' }
  ])

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

    // Validate required fields
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return
    }

    // Filter out empty locations and documents
    const validLocations = locations.filter(loc => loc.value.trim()).map(loc => loc.value.trim())
    const validDocuments = documents.filter(doc => doc.value.trim()).map(doc => doc.value.trim())

    const registrationData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
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

    try {
      await register(registrationData)
      // Reset form on success
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        businessName: '',
        businessAddress: '',
        businessPhone: '',
        taxId: '',
        yearsExperience: '',
        licenseNumber: '',
        insuranceProvider: '',
        insurancePolicyNumber: ''
      })
      setLocations([{ value: '', id: '1' }])
      setDocuments([{ value: '', id: '1' }])
    } catch (err) {
      // Error is handled by the hook
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t('constructor.registration.title', 'Constructor Registration')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('constructor.registration.subtitle', 'Join our network of professional contractors')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                {t('constructor.registration.personalInfo', 'Personal Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t('constructor.registration.firstName', 'First Name')} *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">{t('constructor.registration.lastName', 'Last Name')} *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">{t('constructor.registration.email', 'Email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">{t('constructor.registration.password', 'Password')} *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">{t('constructor.registration.phone', 'Phone Number')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+250788123456"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                {t('constructor.registration.businessInfo', 'Business Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">{t('constructor.registration.businessName', 'Business Name')}</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessPhone">{t('constructor.registration.businessPhone', 'Business Phone')}</Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="businessAddress">{t('constructor.registration.businessAddress', 'Business Address')}</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">{t('constructor.registration.taxId', 'Tax ID')}</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="yearsExperience">{t('constructor.registration.yearsExperience', 'Years of Experience')}</Label>
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
                <Label htmlFor="licenseNumber">{t('constructor.registration.licenseNumber', 'License Number')}</Label>
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
                  {t('constructor.registration.location', 'Service Locations')}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLocation}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('constructor.registration.addLocation', 'Add Location')}
                </Button>
              </div>
              
              {locations.map((location, index) => (
                <div key={location.id} className="flex gap-2">
                  <Input
                    value={location.value}
                    onChange={(e) => updateLocation(location.id, e.target.value)}
                    placeholder={t('constructor.registration.locationPlaceholder', 'e.g., Kigali City, Gasabo')}
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
                {t('constructor.registration.insuranceInfo', 'Insurance Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insuranceProvider">{t('constructor.registration.insuranceProvider', 'Insurance Provider')}</Label>
                  <Input
                    id="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="insurancePolicyNumber">{t('constructor.registration.insurancePolicyNumber', 'Policy Number')}</Label>
                  <Input
                    id="insurancePolicyNumber"
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('constructor.registration.documents', 'Documents')}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDocument}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('constructor.registration.addDocument', 'Add Document')}
                </Button>
              </div>
              
              {documents.map((document, index) => (
                <div key={document.id} className="flex gap-2">
                  <Input
                    value={document.value}
                    onChange={(e) => updateDocument(document.id, e.target.value)}
                    placeholder={t('constructor.registration.documentPlaceholder', 'Document URL or file path')}
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
                    {t('constructor.registration.registering', 'Registering...')}
                  </div>
                ) : (
                  t('constructor.registration.register', 'Register as Constructor')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
