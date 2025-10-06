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
import { useRequests } from '@/app/hooks/useRequests';
import { CreateServiceRequestData } from '@/app/services/requestService';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { architectService, type Architect } from '@/app/services/architectService';
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

  const { createRequest, loading: requestLoading } = useRequests();

  useEffect(() => {
    if (!portfolioId) return;
    getById(portfolioId).then(setItem).catch(() => setItem(null));
  }, [getById, portfolioId]);

  // Fetch architect info for portfolio owner
  useEffect(() => {
    const fetchArchitect = async () => {
      try {
        if (item?.architectId) {
          const data = await architectService.getArchitectById(item.architectId);
          // Some endpoints wrap data under { success, data }
          const normalized: Architect = (data as any)?.data ?? (data as any);
          setArchitect(normalized);
        }
      } catch (e) {
        setArchitect(null);
      }
    };
    fetchArchitect();
  }, [item?.architectId]);

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
    if (!requestData.description.trim() || !requestData.location.trim() || requestData.budget <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!item) {
      toast.error('Portfolio information not available');
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to request a service');
      return;
    }

    try {
      const serviceRequestData: CreateServiceRequestData = {
        technicianId: portfolioId, // Use portfolio ID as technician ID
        category: requestData.category || 'GENERAL',
        description: requestData.description,
        location: requestData.location,
        urgency: requestData.urgency,
        budget: requestData.budget
      };

      await createRequest(serviceRequestData);
      setShowRequestForm(false);
      setRequestData({
        category: 'PLUMBER',
        description: '',
        location: '',
        urgency: 'MEDIUM',
        budget: 0
      });
      toast.success('Service request submitted successfully!');
    } catch (error) {
      console.error('Failed to create service request:', error);
      toast.error('Failed to submit service request. Please try again.');
    }
  };
 console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA",item);
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
                  <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
              <Badge className={item.isPublic ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}>
                    <Eye className="w-3 h-3 mr-1" />
                    {item.isPublic ? "Visible" : "Hidden"}
              </Badge>
            </div>
                <p className="text-sm text-gray-600">{item.skills?.[0] || 'Portfolio'}</p>
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
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Details</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-sm">{item.location || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-sm">{item.workDate || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-sm">{item.duration || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-sm font-semibold">{item.budget || "—"}</span>
                  </div>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>

                {/* Skills */}
                {item.skills && item.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
                  {architect?.user?.profilePic ? (
                    <img
                      src={architect.user.profilePic}
                      alt={`${architect.user.firstName} ${architect.user.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {getInitials(`${architect?.user?.firstName ?? 'P'} ${architect?.user?.lastName ?? ''}`)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{architect ? `${architect.user.firstName} ${architect.user.lastName}` : 'Portfolio Owner'}</h3>
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.8</span>
                      <span className="text-sm text-gray-500">(127 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
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
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-2" />
                    View profile
                  </button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </button>
                </div>
              </div>

              {/* Service Request Form */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Service</h3>
                
                {!showRequestForm ? (
                  <div className="space-y-4">
                    <button 
                      onClick={handleRequestServiceClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Request Service
                    </button>
                    
                    {!isAuthenticated && (
                      <p className="text-xs text-gray-500 text-center">
                        You need to be logged in to request a service
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
                            <span className="text-sm font-medium text-blue-600">
                              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              {user.firstName + " " + user.lastName || 'User'}
                            </p>
                            <p className="text-xs text-blue-700">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={requestData.category}
                        onChange={(e) => setRequestData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="PLUMBER">PLUMBER</option>
                        <option value="ELECTRICIAN">ELECTRICIAN</option>
                        <option value="CARPENTER">CARPENTER</option>
                        <option value="MASON">MASON</option>
                        <option value="PAINTER">PAINTER</option>
                        <option value="ROOFER">ROOFER</option>
                        <option value="TILER">TILER</option>
                        <option value="WELDER">WELDER</option>
                        <option value="LOCKSMITH">LOCKSMITH</option>
                        <option value="HVAC_TECHNICIAN">HVAC_TECHNICIAN</option>
                        <option value="LANDSCAPER">LANDSCAPER</option>
                        <option value="HANDYMAN">HANDYMAN</option>
                        <option value="PEST_CONTROL">PEST_CONTROL</option>
                        <option value="CLEANER">CLEANER</option>
                        <option value="GLASS_TECHNICIAN">GLASS_TECHNICIAN</option>
                        <option value="INSULATION_INSTALLER">INSULATION_INSTALLER</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Description *
                      </label>
                      <textarea
                        value={requestData.description}
                        onChange={(e) => setRequestData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Need to fix a leaking pipe in the kitchen"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={3}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Describe the service you need in detail
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={requestData.location}
                        onChange={(e) => setRequestData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Kigali, Rwanda"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <select
                        value={requestData.urgency}
                        onChange={(e) => setRequestData(prev => ({ ...prev, urgency: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="LOW">LOW - Can wait a few days</option>
                        <option value="MEDIUM">MEDIUM - Within 1-2 days</option>
                        <option value="HIGH">HIGH - Urgent, same day</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget (RWF) *
                      </label>
                      <input
                        type="number"
                        value={requestData.budget}
                        onChange={(e) => setRequestData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                        placeholder="50000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="0"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your budget in Rwandan Francs
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleRequestService}
                        disabled={requestLoading}
                        className="flex bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {requestLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Check className="w-5 h-5 mr-2" />
                        )}
                        {requestLoading ? 'Submitting...' : 'Submit Request'}
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
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">What happens next?</p>
                          <p className="mt-1">Your service request will be sent to the portfolio owner (technician). They'll review your requirements and respond with a quote and timeline. You'll be notified when they respond.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Verified Professionals</span>
              </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Quality Guarantee</span>
              </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">24/7 Customer Support</span>
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




