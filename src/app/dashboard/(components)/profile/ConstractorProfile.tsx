import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Camera,
  Edit,
  Save,
  Building,
  Users,
  TrendingUp,
  FileText,
  Loader2,
  X,
  Shield,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { constructorService, TechnicianData } from '@/app/services/constructorService';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [profile, setProfile] = useState<TechnicianData | null>(null);
  const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    taxId: '',
    location: [] as string[],
    yearsExperience: '',
    licenseNumber: '',
    insuranceInfo: {
      provider: '',
      policyNumber: ''
    },
    documents: [] as string[],
    payoutMethod: {
      type: '',
      accountNumber: ''
    }
  });

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileDt = await constructorService.getCurrentProfile();
        const profileData = profileDt.data;
        console.log('✅ Profile data received:', profileData);
        console.log('🔍 Raw profile data structure:', {
          id: profileData.id,
          businessName: (profileData as any).businessName,
          businessAddress: (profileData as any).businessAddress,
          businessPhone: (profileData as any).businessPhone,
          taxId: (profileData as any).taxId,
          location: profileData.location,
          experience: profileData.experience,
          licenseNumber: (profileData as any).licenseNumber,
          insuranceInfo: (profileData as any).insuranceInfo,
          documents: profileData.documents,
          payoutMethod: profileData.payoutMethod
        });
        setProfile(profileData);

                 // Initialize form data with profile data
         const initialFormData = {
           businessName: (profileData as any).businessName || '',
           businessAddress: (profileData as any).businessAddress || '',
           businessPhone: (profileData as any).businessPhone || '',
           taxId: (profileData as any).taxId || '',
           location: profileData.location || [],
           yearsExperience: (profileData as any).yearsExperience?.toString() || '',
           licenseNumber: (profileData as any).licenseNumber || '',
           insuranceInfo: {
             provider: (profileData as any).insuranceInfo?.provider || '',
             policyNumber: (profileData as any).insuranceInfo?.policyNumber || ''
           },
           documents: profileData.documents || [],
           payoutMethod: {
             type: profileData.payoutMethod?.type || '',
             accountNumber: profileData.payoutMethod?.accountNumber || ''
           }
         };
        console.log('📝 Initial form data:', initialFormData);
        setFormData(initialFormData);
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string | string[] | any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

     const handleEditClick = () => {
     setShowEditDialog(true);
     setError(null);
     setSuccessMessage(null);
     // Initialize form data with current profile data
     if (profile) {
      setFormData({
        businessName: (profile as any).businessName || '',
        businessAddress: (profile as any).businessAddress || '',
        businessPhone: (profile as any).businessPhone || '',
        taxId: (profile as any).taxId || '',
        location: profile.location || [],
        yearsExperience: (profile as any).yearsExperience?.toString() || '',
        licenseNumber: (profile as any).licenseNumber || '',
        insuranceInfo: {
          provider: (profile as any).insuranceInfo?.provider || '',
          policyNumber: (profile as any).insuranceInfo?.policyNumber || ''
        },
        documents: profile.documents || [],
        payoutMethod: {
          type: profile.payoutMethod?.type || '',
          accountNumber: profile.payoutMethod?.accountNumber || ''
        }
      });
    }
  };

     const handleSave = async () => {
     try {
       setLoading(true);
       setError(null); // Clear any previous errors
 
       const updateData = {
         businessName: formData.businessName,
         businessAddress: formData.businessAddress,
         businessPhone: formData.businessPhone,
         taxId: formData.taxId,
         location: formData.location,
         yearsExperience: parseInt(formData.yearsExperience) || 0,
         licenseNumber: formData.licenseNumber,
         insuranceInfo: formData.insuranceInfo,
         documents: formData.documents,
         payoutMethod: formData.payoutMethod
       };
 
       console.log('💾 Sending update data:', updateData);
       console.log('🔍 Current formData:', formData);
       
       const result = await constructorService.updateProfile(updateData);
       console.log('✅ Profile updated successfully:', result);
       
       // Update the profile state with the new data
       // The API returns { success: true, message: string, data: Constructor }
       if ((result as any).data) {
         setProfile((result as any).data);
         console.log('🔄 Profile state updated:', (result as any).data);
       }
       
       // Show success message
       setSuccessMessage('Profile updated successfully!');
       setError(null);
       
       setShowEditDialog(false);
       setIsEditing(false);
     } catch (err: any) {
       console.error('❌ Error updating profile:', err);
       const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
       setError(errorMessage);
     } finally {
       setLoading(false);
     }
   };

     const handleCancelEdit = () => {
     setShowEditDialog(false);
     setIsEditing(false);
     setError(null);
     setSuccessMessage(null);
     // Reset form data to original profile data
     if (profile) {
      setFormData({
        businessName: (profile as any).businessName || '',
        businessAddress: (profile as any).businessAddress || '',
        businessPhone: (profile as any).businessPhone || '',
        taxId: (profile as any).taxId || '',
        location: profile.location || [],
        yearsExperience: (profile as any).yearsExperience?.toString() || '',
        licenseNumber: (profile as any).licenseNumber || '',
        insuranceInfo: {
          provider: (profile as any).insuranceInfo?.provider || '',
          policyNumber: (profile as any).insuranceInfo?.policyNumber || ''
        },
        documents: profile.documents || [],
        payoutMethod: {
          type: profile.payoutMethod?.type || '',
          accountNumber: profile.payoutMethod?.accountNumber || ''
        }
      });
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No profile data found</p>
        </div>
      </div>
    );
  }

     const stats = [
     { label: 'Years Experience', value: profile.yearsExperience?.toString() || '0', icon: Calendar },
     { label: 'Commission Rate', value: `${profile.commissionRate}%`, icon: Award },
     { label: 'Member Since', value: new Date(profile.createdAt).toLocaleDateString(), icon: Star }
   ];
  return (
    <div className="w-fullbg-gray-50 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-title font-bold text-gray-900 mb-2">Constructor Profile</h1>
        <p className="text-gray-600">Manage your professional information and credentials</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-700 rounded-t-xl"></div>

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={profile.user?.profilePic || "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleEditClick}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-mid font-bold text-gray-900 mb-2">
                {profile.user?.firstName + " " + profile.user?.lastName}
              </h2>

              <p className="text-gray-600 mb-4">Professional Constructor</p>

              <div className="space-y-2 text-small">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{profile.user?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{profile.user?.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{profile.location?.length > 0 ? profile.location.join(', ') : 'No locations specified'}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-mid font-bold text-gray-900">{stat.value}</p>
                    <p className="text-small text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Professional Information */}
        <div className="space-y-6 bord">
          {/* Experience & Categories */}
          <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
                         <div className="flex items-center justify-between px-6 py-4">
               <h1 className="text-mid font-semibold text-gray-900">Professional Info</h1>
               <button 
                 onClick={handleEditClick}
                 className="text-amber-500 font-medium p-0 h-auto bg-transparent border-none cursor-pointer hover:text-amber-600"
               >
                 Edit
               </button>
             </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 {
                   icon: Calendar,
                   label: 'Years of Experience',
                   value: `${(profile as any).yearsExperience || 'Not specified'} years`
                 },
                 {
                   icon: Building,
                   label: 'Business Name',
                   value: profile.businessName || 'Not specified'
                 },
                {
                  icon: MapPin,
                  label: 'Business Address',
                  value: profile.businessAddress || 'Not specified'
                },
                {
                  icon: Phone,
                  label: 'Business Phone',
                  value: profile.businessPhone || 'Not specified'
                },
                {
                  icon: FileText,
                  label: 'Tax ID',
                  value: profile.taxId || 'Not specified'
                },
                {
                  icon: FileText,
                  label: 'License Number',
                  value: profile.licenseNumber || 'Not specified'
                },
                {
                  icon: Shield,
                  label: 'Insurance Provider',
                  value: profile.insuranceInfo?.provider || 'Not specified'
                },
                {
                  icon: FileText,
                  label: 'Policy Number',
                  value: profile.insuranceInfo?.policyNumber || 'Not specified'
                },
                {
                  icon: FileText,
                  label: 'Documents',
                  value: `${profile.documents?.length || 0} documents`
                },
                {
                  icon: TrendingUp,
                  label: 'Payout Method',
                  value: profile.payoutMethod?.type || 'Not specified'
                },
                {
                  icon: CreditCard,
                  label: 'Account Number',
                  value: profile.payoutMethod?.accountNumber || 'Not specified'
                }
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="w-full px-6 py-4 bg-white active:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium text-base">{item.label}</p>
                        <p className="text-gray-500 text-small mt-1 break-words">{item.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-mid font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Categories
            </h3>
            <div className="space-y-2">
              {profile.categories && profile.categories.length > 0 ? (
                profile.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-small font-medium mr-2 mb-2"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No categories specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents & Status */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-mid font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Account Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-small font-medium ${profile.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    profile.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  {profile.status}
                </span>
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-700">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Join Date</label>
                <p className="text-gray-700">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

            </div>
          </div>

          {/* Professional Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-mid font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Professional Documents
            </h3>
            <div className="space-y-3">
              {profile.documents && profile.documents.length > 0 ? (
                profile.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Document {index + 1}</h4>
                        <p className="text-small text-gray-600">{doc}</p>
                      </div>
                    </div>
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 text-small font-medium"
                    >
                      View
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No documents uploaded yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                         {/* Dialog Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <h3 className="text-mid font-semibold text-gray-900">Edit Profile</h3>
               <button
                 onClick={handleCancelEdit}
                 className="text-gray-400 hover:text-gray-600 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
             </div>
             
             {/* Error/Success Messages */}
             {error && (
               <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                 <p className="text-small">{error}</p>
               </div>
             )}
             {successMessage && (
               <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
                 <p className="text-small">{successMessage}</p>
               </div>
             )}
                         {/* Dialog Content */}
             <div className="p-6 space-y-6">
               {/* Debug Info - Remove this after testing */}
               <div className="bg-gray-100 p-4 rounded-lg text-small">
                 <p><strong>Form Data Debug:</strong></p>
                 <p>Business Name: "{formData.businessName}"</p>
                 <p>Business Address: "{formData.businessAddress}"</p>
                 <p>Business Phone: "{formData.businessPhone}"</p>
                 <p>Tax ID: "{formData.taxId}"</p>
                 <p>License Number: "{formData.licenseNumber}"</p>
                 <p>Years Experience: "{formData.yearsExperience}"</p>
                 <p>Insurance Provider: "{formData.insuranceInfo.provider}"</p>
                 <p>Policy Number: "{formData.insuranceInfo.policyNumber}"</p>
                 <p>Payout Type: "{formData.payoutMethod.type}"</p>
                 <p>Account Number: "{formData.payoutMethod.accountNumber}"</p>
               </div>
              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter business phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-small font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter tax ID"
                  />
                </div>
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-small font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter years of experience"
                  min="0"
                />
              </div>

              {/* Insurance Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceInfo.provider}
                    onChange={(e) => handleInputChange('insuranceInfo', { ...formData.insuranceInfo, provider: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter insurance provider"
                  />
                </div>
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceInfo.policyNumber}
                    onChange={(e) => handleInputChange('insuranceInfo', { ...formData.insuranceInfo, policyNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter policy number"
                  />
                </div>
              </div>

              {/* Payout Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    Payout Method Type
                  </label>
                  <select
                    value={formData.payoutMethod.type}
                    onChange={(e) => handleInputChange('payoutMethod', { ...formData.payoutMethod, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select payout method</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.payoutMethod.accountNumber}
                    onChange={(e) => handleInputChange('payoutMethod', { ...formData.payoutMethod, accountNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter account number"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-small font-medium text-gray-700 mb-2">
                  Locations
                </label>
                <div className="space-y-2">
                  {formData.location.map((loc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={loc}
                        onChange={(e) => {
                          const newLocations = [...formData.location];
                          newLocations[index] = e.target.value;
                          handleInputChange('location', newLocations);
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter location"
                      />
                      <button
                        onClick={() => {
                          const newLocations = formData.location.filter((_, i) => i !== index);
                          handleInputChange('location', newLocations);
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleInputChange('location', [...formData.location, ''])}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                  >
                    + Add Location
                  </button>
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="block text-small font-medium text-gray-700 mb-2">
                  Documents
                </label>
                <div className="space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={doc}
                        onChange={(e) => {
                          const newDocuments = [...formData.documents];
                          newDocuments[index] = e.target.value;
                          handleInputChange('documents', newDocuments);
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter document URL"
                      />
                      <button
                        onClick={() => {
                          const newDocuments = formData.documents.filter((_, i) => i !== index);
                          handleInputChange('documents', newDocuments);
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleInputChange('documents', [...formData.documents, ''])}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                  >
                    + Add Document
                  </button>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;