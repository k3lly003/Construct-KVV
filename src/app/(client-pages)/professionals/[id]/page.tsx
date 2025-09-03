"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Star, Calendar, Award, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Professional {
  id: string;
  title: string;
  provider: {
    name: string;
  };
  gallery: string[];
  location: {
    city: string;
  };
  features: string[];
  role: 'ARCHITECT' | 'CONTRACTOR' | 'TECHNICIAN' | 'SELLER';
  description?: string;
  experience?: string;
  license?: string;
  phone?: string;
  email?: string;
  rating?: number;
  projectsCompleted?: number;
  specialties?: string[];
}

export default function ProfessionalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll use mock data. In a real app, you'd fetch based on the ID
    const mockProfessional: Professional = {
      id: params.id as string,
      title: "MA Ltd",
      provider: {
        name: "Bana Nami"
      },
      gallery: ['/architect.jpg', '/building.jpg', '/planB.jpg'],
      location: {
        city: "Kigali"
      },
      features: [
        'Role: Architect',
        'License: LIC 200',
        'Experience: 8y'
      ],
      role: 'ARCHITECT',
      description: "Experienced architect with over 8 years in residential and commercial design. Specializing in modern sustainable architecture and urban planning.",
      experience: "8 years",
      license: "LIC 200",
      phone: "+250 788 123 456",
      email: "bana.nami@maltd.com",
      rating: 4.8,
      projectsCompleted: 45,
      specialties: ["Residential Design", "Commercial Architecture", "Sustainable Design", "Urban Planning"]
    };

    // Simulate API call
    setTimeout(() => {
      setProfessional(mockProfessional);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professional details...</p>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Professional Not Found</h1>
          <p className="text-gray-600 mb-6">The professional you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ARCHITECT': return 'bg-amber-100 text-amber-700';
      case 'CONTRACTOR': return 'bg-blue-100 text-blue-700';
      case 'TECHNICIAN': return 'bg-green-100 text-green-700';
      case 'SELLER': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">Professional Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={professional.gallery[0] || '/empty-cart.png'}
                        width={128}
                        height={128}
                        alt={professional.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{professional.title}</h1>
                        <p className="text-xl text-gray-600 mb-3">{professional.provider.name}</p>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className={getRoleColor(professional.role)}>
                            {professional.role}
                          </Badge>
                          <Badge variant="outline">
                            <MapPin className="w-3 h-3 mr-1" />
                            {professional.location.city}
                          </Badge>
                        </div>
                      </div>
                      {professional.rating && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-2xl font-bold">{professional.rating}</span>
                          </div>
                          <p className="text-sm text-gray-500">Based on 24 reviews</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {professional.experience && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{professional.experience} experience</span>
                        </div>
                      )}
                      {professional.projectsCompleted && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{professional.projectsCompleted} projects completed</span>
                        </div>
                      )}
                      {professional.license && (
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>License: {professional.license}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {professional.description || "No description available for this professional."}
                </p>
              </CardContent>
            </Card>

            {/* Specialties */}
            {professional.specialties && professional.specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {professional.gallery && professional.gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {professional.gallery.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={image}
                          width={200}
                          height={200}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {professional.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{professional.phone}</span>
                  </div>
                )}
                {professional.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{professional.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{professional.location.city}</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Now
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Star className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {professional.experience && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold">{professional.experience}</span>
                  </div>
                )}
                {professional.projectsCompleted && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-semibold">{professional.projectsCompleted}</span>
                  </div>
                )}
                {professional.rating && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {professional.rating}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
