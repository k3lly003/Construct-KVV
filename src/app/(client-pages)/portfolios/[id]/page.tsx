"use client";

import { useEffect, useState } from "react";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { useTranslations } from "@/app/hooks/useTranslations";
import { useParams } from "next/navigation";
import { Portfolio } from "@/app/services/porfolioService";
import { usePortfolio } from "@/app/hooks/usePortfolio";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin,
  Camera, 
  Star, 
  Shield, 
  MessageCircle, 
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  AlertCircle
} from "lucide-react";
import { useRequests } from '@/app/hooks/useRequestService';
import { CreateServiceRequestData } from '@/app/services/requestService';
import { useRequestDesign } from '@/app/hooks/useRequestDesign';
import { CreateDesignRequestData } from '@/app/services/requestDesign';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { architectService, type Architect } from '@/app/services/architectService';
import { technicianService, type Technician } from '@/app/services/technicianService';
import { getInitials } from '@/lib/utils';

export default function PortfolioDetailsPage() {
  const { t } = useTranslations();
  const params = useParams();
  const portfolioId = String(params?.id ?? "");
  const { getById, loading } = usePortfolio();
  const [item, setItem] = useState<Portfolio | null>(null);
  
  // Authentication and routing
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  // Service request functionality
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    category: 'PLUMBER',
    description: '',
    location: '',
    urgency: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    budget: 0
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [architect, setArchitect] = useState<Architect | null>(null);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [professionalType, setProfessionalType] = useState<'architect' | 'technician' | null>(null);

  const { createRequest, loading: requestLoading } = useRequests();
  const { createRequest: createDesignRequest, loading: designRequestLoading } = useRequestDesign();

  useEffect(() => {
    if (!portfolioId) return;
    getById(portfolioId).then(setItem).catch(() => setItem(null));
  }, [getById, portfolioId]);

  // Professional checker and fetch professional info
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        if (item?.architectId && !item?.technicianId) {
          // Portfolio owner is an architect
          setProfessionalType('architect');
          const data = await architectService.getArchitectById(item.architectId);
          const normalized: Architect = (data as any)?.data ?? (data as any);
          setArchitect(normalized);
          setTechnician(null);
          } else if (item?.technicianId && !item?.architectId) {
            // Portfolio owner is a technician
            setProfessionalType('technician');
            const data = await technicianService.getTechnicianById(item.technicianId);
            console.log('Technician data structure:', data);
            setTechnician(data);
            setArchitect(null);
        } else {
          // Neither or both - default to architect if architectId exists
          if (item?.architectId) {
            setProfessionalType('architect');
            const data = await architectService.getArchitectById(item.architectId);
            const normalized: Architect = (data as any)?.data ?? (data as any);
            setArchitect(normalized);
          }
          setTechnician(null);
        }
      } catch (e) {
        console.error('Error fetching professional:', e);
        setArchitect(null);
        setTechnician(null);
        setProfessionalType(null);
      }
    };
    
    if (item) {
      fetchProfessional();
    }
  }, [item?.architectId, item?.technicianId]);

  // Handle return URL after login
  useEffect(() => {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl && isAuthenticated) {
      // Clear the return URL
      localStorage.removeItem('returnUrl');
      // Show success message
      toast.success('Welcome back! You can now request a service.');
    }
  }, [isAuthenticated]);

  // Service request handlers
  const nextImage = () => {
    if (item?.images && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item?.images && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  const handleRequestServiceClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the current URL to return after login
      const currentUrl = `/portfolios/${portfolioId}`;
      localStorage.setItem('returnUrl', currentUrl);
      
      // Redirect to signin page
      router.push('/signin');
      toast.info('Please sign in to request a service');
      return;
    }

    // If authenticated, show the request form
    setShowRequestForm(true);
  };

  const handleRequestService = async () => {
    if (!item) {
      toast.error('Portfolio information not available');
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to request a service');
      return;
    }

    try {
      if (professionalType === 'technician') {
        // Use service request API for technicians (simplified)
        const serviceRequestData: CreateServiceRequestData = {
          portfolioId: item.id
        };

        await createRequest(serviceRequestData);
        toast.success('Service request submitted successfully!');
      } else if (professionalType === 'architect') {
        // Use design request API for architects
        const designRequestData: CreateDesignRequestData = {
          portfolioId: item.id
        };

        await createDesignRequest(designRequestData);
        toast.success('Design request submitted successfully!');
      } else {
        toast.error('Unable to determine professional type');
        return;
      }

      setShowRequestForm(false);
      setRequestData({
        category: 'PLUMBER',
        description: '',
        location: '',
        urgency: 'MEDIUM',
        budget: 0
      });
    } catch (error) {
      console.error('Failed to create request:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  // Handle view profile click
  const handleViewProfile = () => {
    if (professionalType === 'architect' && item?.architectId) {
      router.push(`/professionals/architect/architect-${item.architectId}`);
    } else if (professionalType === 'technician' && item?.technicianId) {
      router.push(`/professionals/technician/technician-${item.technicianId}`);
    } else {
      toast.error('Professional profile not available');
    }
  };

 
  return (
    <div className="min-h-screen bg-gray-50">
      <DefaultPageBanner title={t("", "Portfolio Details")} backgroundImage="/store-img.jpg" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!item ? (
          <div className="flex items-center justify-center min-h-[300px] text-amber-800">
            {loading ? "Loading portfolio..." : "Portfolio not found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-mid font-bold text-gray-900">{item.title}</h1>
              <Badge className={item.isPublic ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}>
                    <Eye className="w-3 h-3 mr-1" />
                    {item.isPublic ? "Visible" : "Hidden"}
              </Badge>
            </div>
                <p className="text-small text-gray-600">{item.skills?.[0] || 'Portfolio'}</p>
              </div>

              {/* Image Gallery */}
            {item.images && item.images.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="relative h-96">
                    <img
                      src={item.images[currentImageIndex]}
                      alt={`${item.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {item.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-small">
                      <Camera className="w-4 h-4 inline mr-1" />
                      {currentImageIndex + 1} / {item.images.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {item.images.length > 1 && (
                    <div className="p-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {item.images.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            <img src={photo} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Portfolio Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-mid font-semibold text-gray-900 mb-4">Portfolio Details</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-small">{item.location || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-small">{item.workDate || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-small">{item.duration || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-small font-semibold">{item.budget || "—"}</span>
                  </div>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>

                {/* Skills */}
                {item.skills && item.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-mid font-medium text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-small font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
              </div>
            )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Portfolio Owner Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start space-x-4 mb-4">
                  {(architect?.user?.profilePic || technician?.user?.profilePic) ? (
                    <img
                      src={(architect?.user?.profilePic || technician?.user?.profilePic) ?? ''}
                      alt={`${architect?.user?.firstName || technician?.user?.firstName || 'Professional'} ${architect?.user?.lastName || technician?.user?.lastName || ''}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-mid font-medium text-gray-600">
                        {getInitials(`${architect?.user?.firstName || technician?.user?.firstName || 'P'} ${architect?.user?.lastName || technician?.user?.lastName || ''}`)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {architect?.user ? `${architect.user.firstName} ${architect.user.lastName}` : 
                         technician?.user ? `${technician.user.firstName} ${technician.user.lastName}` : 
                         'Portfolio Owner'}
                      </h3>
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-small font-medium text-gray-900">4.8</span>
                      <span className="text-small text-gray-500">(127 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-small text-gray-600">
                  <div className="flex justify-between">
                    <span>Portfolio items:</span>
                    <span className="font-medium">{(item.images?.length ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills:</span>
                    <span className="font-medium">{item.skills?.length || 0}</span>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button 
                    onClick={handleViewProfile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View profile
                  </button>
                </div>
              </div>

              {/* Service Request Form */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-mid font-semibold text-gray-900 mb-4">
                  {professionalType === 'architect' ? 'Request Design' : 'Request Service'}
                </h3>
                
                {!showRequestForm ? (
                  <div className="space-y-4">
                    <button 
                      onClick={handleRequestServiceClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      {professionalType === 'architect' ? 'Request Design' : 'Request Service'}
                    </button>
                    
                    {!isAuthenticated && (
                      <p className="text-small text-gray-500 text-center">
                        You need to be logged in to {professionalType === 'architect' ? 'request a design' : 'request a service'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* User Info */}
                    {isAuthenticated && user && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-small font-medium text-blue-600">
                              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-small font-medium text-blue-900">
                              {user.firstName + " " + user.lastName || 'User'}
                            </p>
                            <p className="text-small text-blue-700">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <div className="text-blue-500 mt-0.5">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-small text-blue-800">
                          <p className="font-medium">
                            {professionalType === 'architect' ? 'Design Request' : 'Service Request'}
                          </p>
                          <p className="mt-1">
                            {professionalType === 'architect' 
                              ? 'This will send a design request to the architect. They will contact you to discuss your project requirements.'
                              : 'This will send a service request to the technician. They will contact you to discuss your service needs.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleRequestService}
                        disabled={requestLoading || designRequestLoading}
                        className="flex bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {(requestLoading || designRequestLoading) ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Check className="w-5 h-5 mr-2" />
                        )}
                        {(requestLoading || designRequestLoading) ? 'Submitting...' : 'Submit Request'}
                      </button>
                      <button
                        onClick={() => setShowRequestForm(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-small text-blue-800">
                          <p className="font-medium">What happens next?</p>
                          <p className="mt-1">
                            Your {professionalType === 'architect' ? 'design' : 'service'} request will be sent to the portfolio owner ({professionalType === 'architect' ? 'architect' : 'technician'}). 
                            They'll review your requirements and respond with a quote and timeline. You'll be notified when they respond.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-mid font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-small text-gray-700">Verified Professionals</span>
              </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-small text-gray-700">Quality Guarantee</span>
              </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span className="text-small text-gray-700">24/7 Customer Support</span>
            </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




