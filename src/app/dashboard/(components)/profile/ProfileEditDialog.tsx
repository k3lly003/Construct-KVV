import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, X } from 'lucide-react';
import { Constructor } from '@/app/services/constructorService';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Constructor | null;
  onSave: (updatedProfile: Partial<Constructor>) => Promise<void>;
  loading: boolean;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  loading
}) => {
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
  });

  // Initialize form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        businessName: profile.businessName || '',
        businessAddress: profile.businessAddress || '',
        businessPhone: profile.businessPhone || '',
        taxId: profile.taxId || '',
        yearsExperience: profile.yearsExperience?.toString() || '',
        licenseNumber: profile.licenseNumber || '',
        insuranceProvider: profile.insuranceInfo?.provider || '',
        insurancePolicyNumber: profile.insuranceInfo?.policyNumber || '',
        payoutType: profile.payoutMethod?.type || '',
        payoutAccountNumber: profile.payoutMethod?.accountNumber || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!profile) return;

    const updateData = {
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessPhone: formData.businessPhone,
      taxId: formData.taxId,
      location: profile.location || [],
      yearsExperience: parseInt(formData.yearsExperience) || 0,
      licenseNumber: formData.licenseNumber,
      insuranceInfo: {
        provider: formData.insuranceProvider,
        policyNumber: formData.insurancePolicyNumber
      },
      documents: profile.documents || [],
      payoutMethod: {
        type: formData.payoutType,
        accountNumber: formData.payoutAccountNumber
      }
    };

    await onSave(updateData);
    onClose();
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (profile) {
      setFormData({
        businessName: profile.businessName || '',
        businessAddress: profile.businessAddress || '',
        businessPhone: profile.businessPhone || '',
        taxId: profile.taxId || '',
        yearsExperience: profile.yearsExperience?.toString() || '',
        licenseNumber: profile.licenseNumber || '',
        insuranceProvider: profile.insuranceInfo?.provider || '',
        insurancePolicyNumber: profile.insuranceInfo?.policyNumber || '',
        payoutType: profile.payoutMethod?.type || '',
        payoutAccountNumber: profile.payoutMethod?.accountNumber || ''
      });
    }
    onClose();
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-mid font-bold">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your business information and professional credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-mid font-semibold text-gray-900 border-b pb-2">
              Business Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="Enter tax ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPhone">Business Phone</Label>
                <Input
                  id="businessPhone"
                  value={formData.businessPhone}
                  onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  placeholder="Enter business phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  placeholder="Enter years of experience"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  placeholder="Enter license number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                placeholder="Enter business address"
                rows={3}
              />
            </div>
          </div>

          {/* Insurance Information */}
          <div className="space-y-4">
            <h3 className="text-mid font-semibold text-gray-900 border-b pb-2">
              Insurance Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  placeholder="Enter insurance provider"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                <Input
                  id="insurancePolicyNumber"
                  value={formData.insurancePolicyNumber}
                  onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                  placeholder="Enter policy number"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-mid font-semibold text-gray-900 border-b pb-2">
              Payment Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payoutType">Payout Type</Label>
                <Input
                  id="payoutType"
                  value={formData.payoutType}
                  onChange={(e) => handleInputChange('payoutType', e.target.value)}
                  placeholder="e.g., Bank Transfer, PayPal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payoutAccountNumber">Account Number</Label>
                <Input
                  id="payoutAccountNumber"
                  value={formData.payoutAccountNumber}
                  onChange={(e) => handleInputChange('payoutAccountNumber', e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;

