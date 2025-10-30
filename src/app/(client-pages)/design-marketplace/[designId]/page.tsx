"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from '@/app/hooks/useTranslations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Eye, 
  ShoppingCart, 
  Download, 
  Heart, 
  Share2, 
  ArrowLeft,
  Calendar,
  MapPin,
  Ruler,
  Users,
  Home,
  Building,
  Car,
  TreePine,
  Wrench,
  Lightbulb,
  Shield,
  Leaf
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

// Design interface based on the backend API
interface Design {
  id: string;
  title: string;
  description: string;
  buildingDescription: string;
  price: number;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LANDSCAPE' | 'INTERIOR' | 'URBAN_PLANNING' | 'RENOVATION' | 'SUSTAINABLE' | 'LUXURY' | 'AFFORDABLE';
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  images: string[];
  documents: string[];
  tags: string[];
  isActive: boolean;
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  architectId: string;
  architect: {
    id: string;
    businessName: string;
    user: {
      firstName: string;
      lastName: string;
      profilePic?: string;
    };
  };
}

interface DesignResponse {
  success: boolean;
  data: Design;
}

const DesignDetails: React.FC<{ params: Promise<{ designId: string }> }> = ({ params }) => {
  const { t } = useTranslations();
  const { role: userRole, isHydrated } = useUserStore();
  const router = useRouter();

  // State management
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [designId, setDesignId] = useState<string | null>(null);

  // Fetch design details from API
  const fetchDesignDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/design/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch design: ${response.status}`);
      }

      const data: DesignResponse = await response.json();
      
      if (data.success) {
        setDesign(data.data);
      } else {
        throw new Error('Failed to load design details');
      }
    } catch (err: any) {
      console.error('Error fetching design details:', err);
      setError(err.message || 'Failed to load design details');
    } finally {
      setLoading(false);
    }
  };

  // Handle design purchase
  const handlePurchase = async () => {
    if (!isHydrated || !userRole) {
      toast.error('Please sign in to purchase designs');
      router.push('/signin');
      return;
    }

    if (!design) return;

    setPurchasing(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please sign in to purchase designs');
        router.push('/signin');
        return;
      }

      const response = await fetch('/api/v1/design/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designId: design.id,
          paymentMethod: 'card'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Design purchased successfully!');
        router.push('/design-orders');
      } else {
        toast.error(data.message || 'Failed to purchase design');
      }
    } catch (err: any) {
      console.error('Error purchasing design:', err);
      toast.error('Failed to purchase design');
    } finally {
      setPurchasing(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: design?.title,
          text: design?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Load design details on component mount
  useEffect(() => {
    const loadDesign = async () => {
      const resolvedParams = await params;
      setDesignId(resolvedParams.designId);
      if (resolvedParams.designId) {
        fetchDesignDetails(resolvedParams.designId);
      }
    };
    
    loadDesign();
  }, [params]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RESIDENTIAL':
        return <Home className="w-5 h-5" />;
      case 'COMMERCIAL':
        return <Building className="w-5 h-5" />;
      case 'INDUSTRIAL':
        return <Wrench className="w-5 h-5" />;
      case 'LANDSCAPE':
        return <TreePine className="w-5 h-5" />;
      case 'INTERIOR':
        return <Lightbulb className="w-5 h-5" />;
      case 'SUSTAINABLE':
        return <Leaf className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'RESIDENTIAL':
        return 'bg-blue-100 text-blue-800';
      case 'COMMERCIAL':
        return 'bg-green-100 text-green-800';
      case 'INDUSTRIAL':
        return 'bg-gray-100 text-gray-800';
      case 'LANDSCAPE':
        return 'bg-emerald-100 text-emerald-800';
      case 'INTERIOR':
        return 'bg-purple-100 text-purple-800';
      case 'SUSTAINABLE':
        return 'bg-green-100 text-green-800';
      case 'LUXURY':
        return 'bg-yellow-100 text-yellow-800';
      case 'AFFORDABLE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading design details...</p>
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading design</p>
              <p className="text-sm">{error || 'Design not found'}</p>
              <div className="mt-4 flex gap-2 justify-center">
                <Button onClick={() => designId && fetchDesignDetails(designId)} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.push('/design-marketplace')} variant="outline">
                  Back to Marketplace
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Link href="/design-marketplace">
              <Button variant="outline" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                All Designs
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={design.images[selectedImageIndex] || '/placeholder-design.jpg'}
                    alt={design.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {design.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {design.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                              selectedImageIndex === index 
                                ? 'border-amber-500' 
                                : 'border-white/50'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${design.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Design Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{design.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {design.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getCategoryColor(design.category)} flex items-center gap-1`}>
                      {getCategoryIcon(design.category)}
                      {design.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Building Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">What You Can Build</h3>
                  <p className="text-gray-700">{design.buildingDescription}</p>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {design.squareFootage && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Ruler className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-600">Area</p>
                          <p className="font-semibold">{design.squareFootage} sq ft</p>
                        </div>
                      </div>
                    )}
                    {design.bedrooms && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Home className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-600">Bedrooms</p>
                          <p className="font-semibold">{design.bedrooms}</p>
                        </div>
                      </div>
                    )}
                    {design.bathrooms && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-600">Bathrooms</p>
                          <p className="font-semibold">{design.bathrooms}</p>
                        </div>
                      </div>
                    )}
                    {design.floors && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-600">Floors</p>
                          <p className="font-semibold">{design.floors}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {design.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {design.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {design.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Documents Included</h3>
                    <div className="space-y-2">
                      {design.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Download className="w-4 h-4 text-amber-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-amber-600">
                      ${design.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">One-time purchase</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{design.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-600">({design.reviewCount})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg font-semibold"
                >
                  {purchasing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Purchase Design
                    </>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{design.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Added {new Date(design.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Architect Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Architect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-amber-800">
                      {design.architect.user.firstName[0]}{design.architect.user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{design.architect.businessName}</p>
                    <p className="text-sm text-gray-600">
                      {design.architect.user.firstName} {design.architect.user.lastName}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetails;
