"use client"

import { useState, useEffect } from 'react'
import { useConstructor } from '@/app/hooks/useConstructor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  User, 
  Phone, 
  MapPin,
  Building,
  FileText
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Constructor } from '@/app/services/constructorService'

export default function ContractorManagement() {
  const { t } = useTranslation()
  const { 
    getAllContractors, 
    getPendingContractors, 
    updateContractorStatus, 
    contractors, 
    loading, 
    error, 
    clearError 
  } = useConstructor()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContractor, setSelectedContractor] = useState<Constructor | null>(null)
  const [statusUpdate, setStatusUpdate] = useState<'APPROVED' | 'REJECTED'>('APPROVED')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    getAllContractors()
  }, [getAllContractors])

  const handleStatusUpdate = async () => {
    if (!selectedContractor) return

    setIsUpdating(true)
    try {
      await updateContractorStatus(selectedContractor.id, { status: statusUpdate })
      setSelectedContractor(null)
      // Refresh the list
      getAllContractors()
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredContractors = contractors.filter(contractor =>
    contractor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingContractors = contractors.filter(c => c.status === 'PENDING')
  const approvedContractors = contractors.filter(c => c.status === 'APPROVED')
  const rejectedContractors = contractors.filter(c => c.status === 'REJECTED')

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t('admin.contractorManagement.title', 'Contractor Management')}
          </CardTitle>
          <CardDescription>
            {t('admin.contractorManagement.subtitle', 'Manage contractor registrations and approvals')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('admin.contractorManagement.searchPlaceholder', 'Search contractors...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">{pendingContractors.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold">{approvedContractors.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold">{rejectedContractors.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold">{contractors.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                {t('admin.contractorManagement.all', 'All')} ({contractors.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t('admin.contractorManagement.pending', 'Pending')} ({pendingContractors.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                {t('admin.contractorManagement.approved', 'Approved')} ({approvedContractors.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                {t('admin.contractorManagement.rejected', 'Rejected')} ({rejectedContractors.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <ContractorTable 
                contractors={filteredContractors} 
                onViewDetails={setSelectedContractor}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <ContractorTable 
                contractors={pendingContractors} 
                onViewDetails={setSelectedContractor}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <ContractorTable 
                contractors={approvedContractors} 
                onViewDetails={setSelectedContractor}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <ContractorTable 
                contractors={rejectedContractors} 
                onViewDetails={setSelectedContractor}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Contractor Details Dialog */}
      <Dialog open={!!selectedContractor} onOpenChange={() => setSelectedContractor(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t('admin.contractorManagement.contractorDetails', 'Contractor Details')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.contractorManagement.contractorDetailsDesc', 'View and manage contractor information')}
            </DialogDescription>
          </DialogHeader>

          {selectedContractor && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('admin.contractorManagement.basicInfo', 'Basic Information')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-sm">{selectedContractor.firstName} {selectedContractor.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm">{selectedContractor.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-sm">{selectedContractor.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedContractor.status)}</div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t('admin.contractorManagement.businessInfo', 'Business Information')}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Business Name</Label>
                    <p className="text-sm">{selectedContractor.businessName || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Business Address</Label>
                    <p className="text-sm">{selectedContractor.businessAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Business Phone</Label>
                    <p className="text-sm">{selectedContractor.businessPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tax ID</Label>
                    <p className="text-sm">{selectedContractor.taxId || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Years Experience</Label>
                    <p className="text-sm">{selectedContractor.yearsExperience || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">License Number</Label>
                    <p className="text-sm">{selectedContractor.licenseNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Locations */}
              {selectedContractor.location && selectedContractor.location.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {t('admin.contractorManagement.locations', 'Service Locations')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedContractor.location.map((location, index) => (
                      <Badge key={index} variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Insurance */}
              {selectedContractor.insuranceInfo && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {t('admin.contractorManagement.insurance', 'Insurance Information')}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Provider</Label>
                      <p className="text-sm">{selectedContractor.insuranceInfo.provider}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Policy Number</Label>
                      <p className="text-sm">{selectedContractor.insuranceInfo.policyNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedContractor.documents && selectedContractor.documents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {t('admin.contractorManagement.documents', 'Documents')}
                  </h3>
                  <div className="space-y-2">
                    {selectedContractor.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <a 
                          href={doc} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Document {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update */}
              {selectedContractor.status === 'PENDING' && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold">
                    {t('admin.contractorManagement.updateStatus', 'Update Status')}
                  </h3>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="status">
                        {t('admin.contractorManagement.newStatus', 'New Status')}
                      </Label>
                      <Select value={statusUpdate} onValueChange={(value: 'APPROVED' | 'REJECTED') => setStatusUpdate(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APPROVED">
                            {t('admin.contractorManagement.approve', 'Approve')}
                          </SelectItem>
                          <SelectItem value="REJECTED">
                            {t('admin.contractorManagement.reject', 'Reject')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating}
                      className="mt-6"
                    >
                      {isUpdating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('admin.contractorManagement.updating', 'Updating...')}
                        </div>
                      ) : (
                        t('admin.contractorManagement.updateStatus', 'Update Status')
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ContractorTableProps {
  contractors: Constructor[]
  onViewDetails: (contractor: Constructor) => void
  loading: boolean
}

function ContractorTable({ contractors, onViewDetails, loading }: ContractorTableProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t('admin.contractorManagement.loading', 'Loading contractors...')}</p>
      </div>
    )
  }

  if (contractors.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          {t('admin.contractorManagement.noContractors', 'No contractors found.')}
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('admin.contractorManagement.table.name', 'Name')}</TableHead>
          <TableHead>{t('admin.contractorManagement.table.business', 'Business')}</TableHead>
          <TableHead>{t('admin.contractorManagement.table.contact', 'Contact')}</TableHead>
          <TableHead>{t('admin.contractorManagement.table.status', 'Status')}</TableHead>
          <TableHead>{t('admin.contractorManagement.table.actions', 'Actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractors.map((contractor) => (
          <TableRow key={contractor.id}>
            <TableCell>
              <div>
                <p className="font-medium">{contractor.firstName} {contractor.lastName}</p>
                <p className="text-sm text-gray-500">{contractor.email}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{contractor.businessName || 'N/A'}</p>
                <p className="text-sm text-gray-500">{contractor.businessAddress || 'N/A'}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{contractor.phone || 'N/A'}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {/* {getStatusIcon(contractor.status)}
                {getStatusBadge(contractor.status)} */}
              </div>
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(contractor)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {t('admin.contractorManagement.viewDetails', 'View')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
