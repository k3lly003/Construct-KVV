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
  Tag
} from 'lucide-react';
import { architectService, Architect, ArchitectProfileData } from '@/app/services/architectService';

const ArchitectureProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Architect | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    yearsExperience: '',
    businessName: '',
    licenseNumber: '',
    location: [] as string[],
    specializations: [] as string[]
  });

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching architect profile...');
        const response = await architectService.getCurrentProfile();
        const profileData = response.data;
        console.log('✅ Profile data received:', profileData);
        console.log('📊 Profile data structure:', {
          id: profileData.id,
          businessName: profileData.businessName,
          licenseNumber: profileData.licenseNumber,
          yearsExperience: profileData.yearsExperience,
          location: profileData.location,
          specializations: profileData.specializations,
          status: profileData.status,
          commissionRate: profileData.commissionRate,
          documents: profileData.documents,
          user: profileData.user
        });
        setProfile(profileData);

        // Initialize form data with profile data
        const initialFormData = {
          yearsExperience: profileData.yearsExperience?.toString() || '',
          businessName: profileData.businessName || '',
          licenseNumber: profileData.licenseNumber || '',
          location: profileData.location || [],
          specializations: profileData.specializations || []
        };
        console.log('📝 Initial form data:', initialFormData);
        setFormData(initialFormData);
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        console.error('❌ Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updateData: ArchitectProfileData = {
        businessName: formData.businessName,
        licenseNumber: formData.licenseNumber,
        yearsExperience: parseInt(formData.yearsExperience) || 0,
        location: formData.location,
        specializations: formData.specializations,
        documents: profile?.documents || []
      };

      const result = await architectService.updateProfile(updateData);
      console.log('✅ Profile updated successfully:', result);
      setProfile(result.architect);
      setIsEditing(false);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false)
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    { label: 'License Number', value: profile.licenseNumber || 'N/A', icon: Award },
    { label: 'Specializations', value: profile.specializations?.length?.toString() || '0', icon: Tag },
    { label: 'Status', value: profile.status, icon: Star }
  ];

  return (
    <div className="max-w-6xl bg-gray-50 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Architect Profile</h1>
        <p className="text-gray-600">Manage your professional information and credentials</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl"></div>

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isEditing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
              <span>
                {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
              </span>
            </button>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile.user?.firstName + " " + profile.user?.lastName}
              </h2>

              <p className="text-gray-600 mb-4">Professional Architect</p>

              <div className="space-y-2 text-sm">
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
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Professional Information */}
        <div className="space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Business Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Business Name"
                  />
                ) : (
                  <p className="text-gray-700">{profile.businessName || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="License Number"
                  />
                ) : (
                  <p className="text-gray-700">{profile.licenseNumber || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Years of Experience"
                  />
                ) : (
                  <p className="text-gray-700">{profile.yearsExperience || 'Not specified'} years</p>
                )}
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Specializations
            </h3>
            <div className="space-y-2">
              {profile.specializations && profile.specializations.length > 0 ? (
                profile.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mr-2 mb-2"
                  >
                    {spec}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No specializations specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents & Status */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Account Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  profile.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  profile.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {profile.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-700">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Professional Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
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
                        <p className="text-sm text-gray-600">{doc}</p>
                      </div>
                    </div>
                    <a 
                      href={doc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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

          {/* Payout Information */}
          {profile.payoutMethod && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Payout Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payout Method</label>
                  <p className="text-gray-700">{profile.payoutMethod.type || 'Not configured'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <p className="text-gray-700">{profile.payoutMethod.accountNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureProfile;