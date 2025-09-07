"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Star, Award, Briefcase } from "lucide-react";
import { constructorService, Constructor } from "@/app/services/constructorService";
import { architectService, Architect } from "@/app/services/architectService";
import { technicianService, Technician } from "@/app/services/technicianService";
import { getAllSellers, SellerProfile } from "@/app/services/sellerService";

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

  const { type, id } = params;

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
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''
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

            {/* Portfolio / Documents as image cards */}
            {portfolioImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolioImages.map((src, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                        <div className="aspect-[4/3]">
                          <Image
                            src={src}
                            alt={`portfolio-${idx}`}
                            width={600}
                            height={450}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            )}
            {portfolioImages.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio</h3>
                <p className="text-gray-600">No portfolio images available.</p>
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
