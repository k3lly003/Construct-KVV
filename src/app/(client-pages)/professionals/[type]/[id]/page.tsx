"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Star, Award, Briefcase, Heart, ChevronLeft, ChevronRight, Clock, DollarSign, MapPin as LocationIcon, MessageCircle } from "lucide-react";
import { constructorService, Constructor } from "@/app/services/constructorService";
import { architectService, Architect, CreateDesignRequestDTO, Portfolio } from "@/app/services/architectService";
import { technicianService, Technician } from "@/app/services/technicianService";
import { getAllSellers, SellerProfile } from "@/app/services/sellerService";
import { useArchitect } from "@/app/hooks/useArchitect";
import { useUserStore } from "@/store/userStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork-production.up.railway.app';

interface ProfessionalData {
  id: string;
  type: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  licenseNumber?: string;
  businessName?: string;
  description?: string;
  profileImage?: string;
  rating?: number;
  features: string[];
  additionalInfo?: any;
}

export default function ProfessionalDetailPage() {
  const params = useParams<{ type: string; id: string }>();
  const router = useRouter();
  const [professional, setProfessional] = useState<ProfessionalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { createDesignrequest, getArchitectPortfolios, getProfessionalPortfolios } = useArchitect();
  
  // Get current user from store
  const { firstName, lastName, email, role, isHydrated } = useUserStore();
  
  // Also get the full user data from localStorage for the ID
  const [fullUserData, setFullUserData] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setFullUserData(parsed);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [isHydrated]);
  
  const currentUser = isHydrated && firstName && fullUserData ? { 
    id: fullUserData.id || fullUserData._id || email, // Try different ID fields
    firstName, 
    lastName, 
    email, 
    role,
    ...fullUserData // Include all user data
  } : null;


  const { type, id } = params;

  // Handle design request submission
  const handleDesignRequest = async () => {
    if (!currentUser || !selectedPortfolioId) return;
    
    setRequestError(null);
    setRequestSuccess(null);
    
    try {
      const data: CreateDesignRequestDTO = {
        portfolioId: selectedPortfolioId
      };
      
      await createDesignrequest(data);
      setRequestSuccess('Design request sent successfully! The architect will contact you directly.');
    } catch (err: any) {
      setRequestError(err.response?.data?.message || err.message || 'Failed to send design request');
    }
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    const phoneNumber = contactBusinessPhone || professional?.phone;
    
    if (phoneNumber) {
      // Remove any non-numeric characters and add country code if needed
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const whatsappNumber = cleanNumber.startsWith('250') ? cleanNumber : `250${cleanNumber}`;
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    } else {
      alert('Phone number not available');
    }
  };

  // Handle image slider navigation
  const nextImage = () => {
    if (portfolios.length > 0 && selectedPortfolioId) {
      const currentPortfolio = portfolios.find(p => p.id === selectedPortfolioId);
      if (currentPortfolio && currentPortfolio.images.length > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % currentPortfolio.images.length);
      }
    }
  };

  const prevImage = () => {
    if (portfolios.length > 0 && selectedPortfolioId) {
      const currentPortfolio = portfolios.find(p => p.id === selectedPortfolioId);
      if (currentPortfolio && currentPortfolio.images.length > 0) {
        setCurrentImageIndex((prev) => (prev - 1 + currentPortfolio.images.length) % currentPortfolio.images.length);
      }
    }
  };

  useEffect(() => {
    const fetchProfessional = async () => {
      if (!type || !id) return;

      setLoading(true);
      try {
        if (typeof window !== 'undefined') {
          console.log('[ProfessionalDetail] params:', { type, id })
        }
        let data: ProfessionalData | null = null;

        switch (type) {
          case 'contractor':
            const contractors = await constructorService.getApprovedContractors();
            const contractor = (contractors || []).find(c => c.id === id.replace('contractor-', ''));
            
            if (contractor) {
              data = {
                id: contractor.id,
                type: 'Contractor',
                name: `${(contractor as any).firstName || ''} ${(contractor as any).lastName || ''}`.trim(),
                title: contractor.businessName || 'Contractor',
                email: (contractor as any).user?.email || '',
                phone: (contractor as any).phone || '',
                location: contractor.location?.[0] || '',
                experience: contractor.yearsExperience || 0,
                licenseNumber: contractor.licenseNumber,
                businessName: contractor.businessName,
                description: (contractor as any).description || '',
                profileImage: (contractor as any).user?.profilePic,
                features: [
                  `Experience: ${contractor.yearsExperience || 0} years`,
                  ...(contractor.licenseNumber ? [`License: ${contractor.licenseNumber}`] : []),
                ],
                additionalInfo: contractor
              };
            }
            break;

          case 'architect':
            const architects = await architectService.getApprovedArchitects();
            const architect = (architects || []).find((a: any) => a.id === id.replace('architect-', ''));
            
            if (architect) {
              data = {
                id: architect.id,
                type: 'Architect',
                name: `${architect.user?.firstName || ''} ${architect.user?.lastName || ''}`.trim(),
                title: architect.businessName || 'Architect',
                email: architect.user?.email || '',
                phone: architect.user?.phone || '',
                location: architect.location?.[0] || '',
                experience: architect.yearsExperience || 0,
                licenseNumber: architect.licenseNumber,
                businessName: architect.businessName,
                description: (architect as any).description || '',
                profileImage: architect.user?.profilePic || undefined,
                features: [
                  `Experience: ${architect.yearsExperience || 0} years`,
                  ...(architect.licenseNumber ? [`License: ${architect.licenseNumber}`] : []),
                ],
                additionalInfo: architect
              };
            }
            break;

          case 'technician':
            const technicians = await technicianService.getApprovedTechnicians();
            const technician = (technicians || []).find((t: any) => t.id === id.replace('technician-', ''));
            
            if (technician) {
              data = {
                id: technician.id,
                type: 'Technician',
                name: `${technician.user?.firstName || ''} ${technician.user?.lastName || ''}`.trim(),
                title: 'Technician',
                email: technician.user?.email || '',
                phone: technician.user?.phone || '',
                location: technician.location?.[0] || '',
                experience: technician.experience || 0,
                description: (technician as any).description || '',
                profileImage: technician.user?.profilePic || undefined,
                features: [
                  `Experience: ${technician.experience || 0} years`,
                  ...(Array.isArray(technician.categories) ? technician.categories.slice(0, 3) : []),
                ],
                additionalInfo: technician
              };
            }
            break;

          case 'seller':
            const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
            if (authToken) {
              const sellers = await getAllSellers(authToken);
              const seller = (sellers || []).find((s: any) => s._id === id.replace('seller-', ''));
              
              if (seller) {
                data = {
                  id: seller._id,
                  type: 'Seller',
                  name: `${seller.user?.firstName || ''} ${seller.user?.lastName || ''}`.trim(),
                  title: seller.businessName || 'Seller',
                  email: seller.user?.email || '',
                  phone: seller.businessPhone || '',
                  location: seller.businessAddress || '',
                  experience: 0,
                  businessName: seller.businessName,
                  description: (seller as any).shopDescription || '',
                  profileImage: (seller as any).user?.profilePic,
                  features: [
                    ...(seller.taxId ? [`Tax ID: ${seller.taxId}`] : []),
                    `Phone: ${seller.businessPhone || 'N/A'}`,
                  ],
                  additionalInfo: seller
                };
              }
            }
            break;
        }

        if (data) {
          setProfessional(data);
        } else {
          setError('Professional not found');
        }
      } catch (err) {
        console.error('Error fetching professional:', err);
        setError('Failed to load professional details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [type, id]);

  useEffect(() => {
    if (professional && typeof window !== 'undefined') {
      console.log('[ProfessionalDetail] normalized professional:', professional)
      console.log('[ProfessionalDetail] additionalInfo:', professional.additionalInfo || {})
    }
  }, [professional])

  // Fetch portfolios for professionals
  useEffect(() => {
    const fetchPortfolios = async () => {
      if (professional) {
        try {
          // Map professional type to API format
          const professionalTypeMap: Record<string, 'architect' | 'contractor' | 'technician' | 'seller'> = {
            'Architect': 'architect',
            'Contractor': 'contractor', 
            'Technician': 'technician',
            'Seller': 'seller'
          };
          
          const apiType = professionalTypeMap[professional.type];
          
          if (apiType) {
            const portfoliosData = await getProfessionalPortfolios(apiType, professional.id);
            setPortfolios(portfoliosData);
            // Set the first portfolio as selected by default
            if (portfoliosData.length > 0) {
              setSelectedPortfolioId(portfoliosData[0].id);
              setCurrentImageIndex(0); // Reset image index
            }
          }
        } catch (err) {
          console.error('Error fetching portfolios:', err);
        }
      }
    };

    fetchPortfolios();
  }, [professional, getProfessionalPortfolios]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading professional details...</p>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Professional Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The professional you are looking for does not exist.'}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Derived details from the raw object to enrich the page
  const raw: any = professional.additionalInfo || {}
  const categories: string[] = Array.isArray(raw.categories) ? raw.categories : []
  const documents: string[] = Array.isArray(raw.documents) ? raw.documents : []
  const locations: string[] = Array.isArray(raw.location) ? raw.location : (professional.location ? [professional.location] : [])
  const userInfo: any = raw.user || {}
  const isValidImageUrl = (src?: string) => !!src && (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://'))
  const contactBusinessPhone: string | undefined = raw.businessPhone || userInfo.phone || professional.phone
  const contactBusinessEmail: string | undefined = raw.businessEmail || userInfo.email || professional.email
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork-production.up.railway.app'
  const normalizeDocUrl = (name?: string) => {
    if (!name) return undefined
    if (isValidImageUrl(name)) return name
    const trimmed = name.replace(/^\/+/, '')
    const encoded = encodeURIComponent(trimmed)
    // Try common asset roots
    const candidates = [
      `${API_BASE}/uploads/${encoded}`,
      `${API_BASE}/files/${encoded}`,
      `${API_BASE}/${encoded}`,
    ]
    return candidates[0]
  }
  const documentImageUrls = (documents || [])
    .map((n) => normalizeDocUrl(n))
    .filter((v): v is string => typeof v === 'string')
  // Extract images from multiple possible fields
  const candidateArrays: Array<unknown> = [
    documentImageUrls,
    raw.gallery,
    raw.images,
    raw.photos,
    raw.attachments,
    Array.isArray(raw.projects) ? raw.projects.map((p: any) => p?.image || p?.cover || p?.thumbnail) : [],
  ]
  const flattened = candidateArrays
    .filter(Boolean)
    .flatMap((arr: any) => (Array.isArray(arr) ? arr : []))
  const rawPortfolio = [professional.profileImage, ...flattened] as Array<string | undefined>
  const portfolioImages: string[] = Array.from(new Set(
    rawPortfolio.filter((v): v is string => typeof v === 'string' && isValidImageUrl(v))
  )).slice(0, 12)
  if (typeof window !== 'undefined') {
    console.log('[ProfessionalDetail] portfolioImages:', portfolioImages)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Professionals
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={isValidImageUrl(professional.profileImage) ? (professional.profileImage as string) : '/empty-cart.png'}
                  alt={professional.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {professional.type}
                </span>
                {professional.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{professional.rating}</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{professional.name}</h1>
              <h2 className="text-xl text-gray-600 mb-4">{professional.title}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {professional.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{professional.email}</span>
                  </div>
                )}
                {professional.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{professional.phone}</span>
                  </div>
                )}
                {professional.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{professional.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {professional.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-600 leading-relaxed">{professional.description}</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {(userInfo.firstName || userInfo.lastName) && (
                  <div className="flex items-center gap-3">
                    <ArrowLeft className="w-4 h-4 text-gray-500 rotate-90" />
                    <div>
                      <p className="font-medium text-gray-900">Business Owner</p>
                      <p className="text-gray-600">{`${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim()}</p>
                    </div>
                  </div>
                )}
                {professional.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{userInfo.email || professional.email}</p>
                    </div>
                  </div>
                )}
                {professional.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{userInfo.phone || professional.phone}</p>
                    </div>
                  </div>
                )}
                {professional.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{(Array.isArray(raw.location) ? raw.location[0] : '') || professional.location}</p>
                    </div>
                  </div>
                )}
                {professional.businessName && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Business Name</p>
                      <p className="text-gray-600">{professional.businessName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Experience & Qualifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience & Qualifications</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Years of Experience</p>
                    <p className="text-gray-600">{professional.experience} years</p>
                  </div>
                </div>
                
                {professional.licenseNumber && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">License Number</p>
                      <p className="text-gray-600">{professional.licenseNumber}</p>
                    </div>
                  </div>
                )}

                {professional.businessName && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Business Name</p>
                      <p className="text-gray-600">{professional.businessName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills / Services */}
            {categories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Services</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span key={cat} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Section */}
            {portfolios.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Portfolio</h3>
                  {professional.type === 'Architect' && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">You like this work?</p>
                      {currentUser ? (
                        <Button 
                          onClick={handleDesignRequest}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          size="sm"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Request Design
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => router.push('/signin')}
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                          size="sm"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Sign In to Request
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Success/Error Messages */}
                {requestSuccess && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {requestSuccess}
                  </div>
                )}
                {requestError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {requestError}
                  </div>
                )}

                {/* Portfolio Items */}
                {portfolios.map((portfolio, portfolioIndex) => (
                  <div key={portfolio.id} className="mb-8 last:mb-0">
                    {/* Portfolio Header */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{portfolio.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {portfolio.category}
                        </span>
                        {portfolio.location && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center">
                            <LocationIcon className="w-3 h-3 mr-1" />
                            {portfolio.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Portfolio Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Image Slider */}
                      <div className="relative">
                        {portfolio.images.length > 0 ? (
                          <div className="relative">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                          <Image
                                src={portfolio.images[currentImageIndex]}
                                alt={portfolio.title}
                            width={600}
                            height={450}
                            className="w-full h-full object-cover"
                          />
                        </div>
                            
                            {/* Navigation Buttons */}
                            {portfolio.images.length > 1 && (
                              <>
                                <Button
                                  onClick={prevImage}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                  size="sm"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={nextImage}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                  size="sm"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                                
                                {/* Image Counter */}
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {currentImageIndex + 1} / {portfolio.images.length}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center">
                            <p className="text-gray-500">No images available</p>
                          </div>
                        )}
                      </div>

                      {/* Portfolio Information */}
                      <div className="space-y-4">
                        {/* Description */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                          <p className="text-gray-600 text-sm leading-relaxed">{portfolio.description}</p>
                        </div>

                        {/* Project Details */}
                        <div className="grid grid-cols-2 gap-4">
                          {portfolio.budget && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Budget</p>
                                <p className="text-sm font-medium text-gray-900">{portfolio.budget}</p>
                              </div>
                            </div>
                          )}
                          {portfolio.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="text-sm font-medium text-gray-900">{portfolio.duration}</p>
                              </div>
                            </div>
                          )}
                      </div>

                        {/* Skills */}
                        {portfolio.skills && portfolio.skills.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Skills Used</h5>
                            <div className="flex flex-wrap gap-2">
                              {portfolio.skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                                  {skill}
                                </span>
                  ))}
                </div>
              </div>
            )}

                        {/* Client Feedback */}
                        {portfolio.clientFeedback && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Client Feedback</h5>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-700 text-sm italic">"{portfolio.clientFeedback}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {portfolios.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Portfolio</h3>
                  {professional.type === 'Architect' && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">You like this work?</p>
                      {currentUser ? (
                        <Button 
                          onClick={handleDesignRequest}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          size="sm"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Request Design
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => router.push('/signin')}
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                          size="sm"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Sign In to Request
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Success/Error Messages */}
                {requestSuccess && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {requestSuccess}
                  </div>
                )}
                {requestError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {requestError}
                  </div>
                )}
                
                <p className="text-gray-600">No portfolio items available.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-700 space-y-1">
                  {contactBusinessPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{contactBusinessPhone}</span>
                    </div>
                  )}
                  {contactBusinessEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{contactBusinessEmail}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full" asChild>
                  <a href={contactBusinessPhone ? `tel:${contactBusinessPhone}` : '#'}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={contactBusinessEmail ? `mailto:${contactBusinessEmail}` : '#'}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </a>
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-2">
                {professional.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations Served */}
            {locations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Locations Served</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map((loc) => (
                    <span key={loc} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
