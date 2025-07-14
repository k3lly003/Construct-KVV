"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Users, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  Heart,
  Share2,
  MessageCircle,
  Truck,
  Wrench,
  Home
} from "lucide-react";
import serviceData from "../../utils/fakes/soso";
import { GenericButton } from "@/components/ui/generic-button";
import Image from "next/image";

const Page = () =>  {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 my-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Gallery */}
            <Card>
              <CardContent>
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image 
                    src={serviceData.gallery[selectedImage]} 
                    width={34}
                    height={34}
                    alt="Service gallery"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    {serviceData.availability}
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {serviceData.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image src={image} width={34} height={34} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Share & like */}
            <div className="flex items-center gap-2 ml-auto">
              <GenericButton 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsFavorited(!isFavorited)}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                Save
              </GenericButton>
              <GenericButton variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </GenericButton>
            </div>

            {/* Service Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">{serviceData.category}</Badge>
                    <h1 className="text-3xl font-bold text-gray-900">{serviceData.title}</h1>
                    <p className="text-gray-600 mt-2">{serviceData.description}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {serviceData.location.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      {serviceData.location.serviceRadius} radius
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {serviceData.availability}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="warranty">Warranty</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="specifications" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(serviceData.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">{key}</span>
                          <span className="text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="warranty" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">{serviceData.warranty.duration}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Coverage includes:</h4>
                        {serviceData.warranty.coverage.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-4">
                      {serviceData.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="font-medium">{review.author}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">Verified</Badge>
                            )}
                            <span className="text-sm text-gray-500 ml-auto">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${serviceData.pricing.basePrice}</span>
                      <span className="text-gray-600">{serviceData.pricing.unit}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated total: {serviceData.pricing.estimatedTotal}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <GenericButton className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Service
                  </GenericButton>
                  
                  <GenericButton variant="outline" className="w-full" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Quote
                  </GenericButton>
                </div>
              </CardContent>
            </Card>

            {/* Provider Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={serviceData.provider.avatar} 
                      width={34}
                      height={34}
                      alt={serviceData.provider.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{serviceData.provider.name}</h3>
                        {serviceData.provider.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">{serviceData.provider.rating}</span>
                        </div>
                        <span>({serviceData.provider.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>{serviceData.provider.yearsExperience} years exp.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>{serviceData.provider.reviews} clients</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <GenericButton variant="outline" className="w-full justify-start" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Provider
                    </GenericButton>
                    <GenericButton variant="outline" className="w-full justify-start" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </GenericButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Highlights */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Service Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Free Consultation</p>
                      <p className="text-xs text-gray-600">On-site assessment included</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Lifetime Warranty</p>
                      <p className="text-xs text-gray-600">Full coverage guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Professional Tools</p>
                      <p className="text-xs text-gray-600">Commercial grade equipment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;