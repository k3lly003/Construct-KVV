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
    Tag,
    X
    } from 'lucide-react';
    import { getMySellerProfile, SellerProfile as SellerProfileModel } from '@/app/services/sellerService';

    const SellerProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [profile, setProfile] = useState<SellerProfileModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        yearsExperience: '',
        businessName: '',
        licenseNumber: '',
        location: [] as string[],
        documents: [] as string[],
        payoutMethod: {
        type: '',
        accountNumber: ''
        }
    });

    // Fetch current seller profile data
    useEffect(() => {
        const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = typeof window !== 'undefined' ? (localStorage.getItem('authToken') || localStorage.getItem('token') || '') : '';
            console.log('🔍 Fetching seller profile...');
            const response = await getMySellerProfile(token);
            const profileData: any = (response as any)?.data || (response as any)?.seller || response;
            console.log('✅ Seller profile data received:', profileData);
            console.log('📊 Seller profile data structure:', {
            id: profileData?._id || profileData?.id,
            businessName: profileData?.businessName,
            businessAddress: profileData?.businessAddress,
            businessPhone: profileData?.businessPhone,
            taxId: profileData?.taxId,
            status: profileData?.status,
            commissionRate: profileData?.commissionRate,
            payoutMethod: profileData?.payoutMethod,
            user: profileData?.user,
            createdAt: profileData?.createdAt,
            });
            
            // Comprehensive data logging for debugging
            console.log('🔍 FULL SELLER PROFILE DATA:', {
            rawResponse: response,
            profileData: profileData,
            userInfo: {
                firstName: profileData?.user?.firstName,
                lastName: profileData?.user?.lastName,
                email: profileData?.user?.email,
                phone: profileData?.user?.phone,
                createdAt: profileData?.user?.createdAt
            },
            businessInfo: {
                businessName: profileData?.businessName,
                businessAddress: profileData?.businessAddress,
                businessPhone: profileData?.businessPhone,
                taxId: profileData?.taxId,
                licenseNumber: profileData?.licenseNumber
            },
            accountInfo: {
                status: profileData?.status,
                commissionRate: profileData?.commissionRate,
                payoutMethod: profileData?.payoutMethod,
                documents: profileData?.documents,
                portfolios: profileData?.portfolios,
                location: profileData?.location
            },
            metadata: {
                id: profileData?._id || profileData?.id,
                createdAt: profileData?.createdAt,
                updatedAt: profileData?.updatedAt
            }
            });
            if (profileData) {
            setProfile(profileData as SellerProfileModel);
            } else {
            setError('No profile data returned from server');
            }

            // Initialize form data with profile data mapping
            const initialFormData = {
            yearsExperience: '',
            businessName: (profileData as any)?.businessName || '',
            licenseNumber: '',
            location: [],
            documents: (profileData as any)?.documents || [],
            payoutMethod: {
                type: typeof (profileData as any)?.payoutMethod === 'string' ? (profileData as any)?.payoutMethod : (profileData as any)?.payoutMethod?.type || '',
                accountNumber: (profileData as any)?.payoutMethod?.accountNumber || ''
            }
            };
            console.log('📝 Initial form data:', initialFormData);
            setFormData(initialFormData);
        } catch (err) {
            console.error('❌ Error fetching seller profile:', err);
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
        if (profile) {
        setFormData({
            yearsExperience: (profile as any)?.yearsExperience?.toString() || '',
            businessName: (profile as any)?.businessName || '',
            licenseNumber: (profile as any)?.licenseNumber || '',
            location: (profile as any)?.location || [],
            documents: (profile as any)?.documents || [],
            payoutMethod: {
            type: (profile as any)?.payoutMethod?.type || '',
            accountNumber: (profile as any)?.payoutMethod?.accountNumber || ''
            }
        });
        }
    };

    const handleSave = async () => {
        // Placeholder: no seller update API wired yet. Keep UI responsive.
        try {
        setLoading(true);
        setError(null);
        const updated: any = {
            ...profile,
            businessName: formData.businessName,
        };
        setProfile(updated);
        setSuccessMessage('Changes saved locally. Hook up update API to persist.');
        setShowEditDialog(false);
        setIsEditing(false);
        } catch (err) {
        console.error('❌ Error applying local changes:', err);
        setError('Failed to save changes');
        } finally {
        setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setShowEditDialog(false);
        setIsEditing(false);
        setError(null);
        setSuccessMessage(null);
        if (profile) {
        setFormData({
            yearsExperience: (profile as any)?.yearsExperience?.toString() || '',
            businessName: (profile as any)?.businessName || '',
            licenseNumber: (profile as any)?.licenseNumber || '',
            location: (profile as any)?.location || [],
            documents: (profile as any)?.documents || [],
            payoutMethod: {
            type: (profile as any)?.payoutMethod?.type || '',
            accountNumber: (profile as any)?.payoutMethod?.accountNumber || ''
            }
        });
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
        { label: 'Years Experience', value: (profile as any)?.yearsExperience?.toString() || '0', icon: Calendar },
        { label: 'License Number', value: (profile as any)?.licenseNumber || (profile as any)?.taxId || 'N/A', icon: Award },
        { label: 'Status', value: profile.status, icon: Star }
    ];

    return (
        <div className="w-fullbg-gray-50 min-h-screen p-6">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Profile</h1>
            <p className="text-gray-600">Manage your business information and credentials</p>
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
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {(profile as any)?.user?.firstName + " " + (profile as any)?.user?.lastName}
                </h2>

                <p className="text-gray-600 mb-4">Professional Seller</p>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    <span>{(profile as any)?.user?.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    <span>{(profile as any)?.user?.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span>{(profile as any)?.businessAddress || 'No address specified'}</span>
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
            <div className="space-y-6 bord">
            {/* Professional Info */}
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-6 py-4">
                <h1 className="text-xl font-semibold text-gray-900">Professional Info</h1>
                <button 
                    onClick={handleEditClick}
                    className="text-amber-600 font-medium p-0 h-auto bg-transparent border-none cursor-pointer hover:text-amber-700"
                >
                    Edit
                </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    {
                    icon: Calendar,
                    label: 'Years of Experience',
                    value: `${(profile as any)?.yearsExperience || 'Not specified'} years`
                    },
                    {
                    icon: Building,
                    label: 'Business Name',
                    value: profile.businessName || 'Not specified'
                    },
                    {
                    icon: Phone,
                    label: 'Business Phone',
                    value: (profile as any)?.businessPhone || 'Not specified'
                    },
                    {
                    icon: FileText,
                    label: 'License Number',
                    value: (profile as any)?.licenseNumber || (profile as any)?.taxId || 'Not specified'
                    },
                    {
                    icon: Tag,
                    label: 'Tax ID',
                    value: (profile as any)?.taxId || 'Not specified'
                    },
                    {
                    icon: MapPin,
                    label: 'Locations',
                    value: Array.isArray((profile as any)?.location) && (profile as any).location.length ? (profile as any).location.join(', ') : 'Not specified'
                    },
                    {
                    icon: FileText,
                    label: 'Documents',
                    value: `${((profile as any)?.documents?.length || 0)} documents`
                    },
                    {
                    icon: TrendingUp,
                    label: 'Commission Rate',
                    value: (profile as any)?.commissionRate !== undefined && (profile as any)?.commissionRate !== null
                        ? `${(profile as any).commissionRate}%`
                        : 'Not specified'
                    },
                    {
                    icon: TrendingUp,
                    label: 'Payout Method',
                    value: (profile as any).payoutMethod?.type || 'Not specified'
                    },
                    {
                    icon: FileText,
                    label: 'Account Number',
                    value: (profile as any).payoutMethod?.accountNumber || 'Not specified'
                    }
                ].map((item, index) => {
                    const IconComponent = item.icon
                    return (
                    <div key={index} className="w-full px-6 py-4 bg-white active:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-white" />
                </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium text-base">{item.label}</p>
                            <p className="text-gray-500 text-sm mt-1 break-words">{item.value}</p>
                </div>
                </div>
            </div>
                    )
                })}
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
                    <p className="text-gray-700">{(profile as any)?.createdAt ? new Date((profile as any).createdAt).toLocaleDateString() : 'N/A'}</p>
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
                {(profile as any)?.documents && (profile as any).documents.length > 0 ? (
                    (profile as any).documents.map((doc: any, index: number) => (
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
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
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

            {/* My Work */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                My Work
                </h3>
                {(() => {
                const works: any[] = (profile as any)?.portfolios || (profile as any)?.documents || [];
                if (!works || works.length === 0) {
                    return <p className="text-gray-500">No work added yet</p>;
                }
                return (
                    <div className="space-y-3">
                    {works.map((item: any, index: number) => {
                        const isObject = item && typeof item === 'object';
                        const title = isObject ? (item.title || `Work ${index + 1}`) : `Work ${index + 1}`;
                        const url = isObject ? (item.url || item.link || item.previewUrl || '') : item;
                        return (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{title}</h4>
                                <p className="text-sm text-gray-600 truncate max-w-[50vw]">{url || 'No link provided'}</p>
                            </div>
                            </div>
                            {url ? (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                            >
                                View
                            </a>
                            ) : null}
                        </div>
                        );
                    })}
                    </div>
                );
                })()}
            </div>
            </div>
        </div>

        {/* Edit Profile Dialog */}
        {showEditDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Dialog Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
                <button
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                </div>

                {/* Dialog Content */}
                <div className="p-6 space-y-6">
                {/* Business Name & License */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                    </label>
                    <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                        placeholder="Enter business name"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                    </label>
                    <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                        placeholder="Enter license number"
                    />
                    </div>
                </div>

                {/* Years of Experience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                    </label>
                    <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                    placeholder="Enter years of experience"
                    min="0"
                    />
                </div>

                {/* Locations */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
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

                {/* Payout Method */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payout Method Type
                    </label>
                    <select
                        value={formData.payoutMethod.type}
                        onChange={(e) => handleInputChange('payoutMethod', { ...formData.payoutMethod, type: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                    >
                        <option value="">Select payout method</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="cash">Cash</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                    </label>
                    <input
                        type="text"
                        value={formData.payoutMethod.accountNumber}
                        onChange={(e) => handleInputChange('payoutMethod', { ...formData.payoutMethod, accountNumber: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                        placeholder="Enter account number"
                    />
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

    export default SellerProfile;