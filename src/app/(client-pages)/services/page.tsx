"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { ServiceGrid } from '@/app/(components)/service/service-grid';
import ServiceBanner from '@/components/features/service/Banner-HIW';
import TrustSecurity from '@/components/features/service/TrustSecurity';

// interface Service {
//   id: string;
//   title: string;
//   description: string;
//   provider: string;
//   rating: number;
//   reviewCount: number;
//   price: string;
//   location: string;
//   specialties: string[];
//   yearsExperience: number;
//   completedProjects: number;
//   image: string;
//   badge?: string;
// }
// Filter services by title

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locationRequest, setLocationRequest] = useState({
    location: '',
    serviceType: '',
    description: '',
    email: '',
    phone: ''
  });
  // const [services, setServices] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);
  // const filteredServices = services.filter((service) =>
  //   service.title?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const handleSearch = () => {
  //   console.log('Searching for services in:', searchQuery);
  // };

  const handleLocationRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Location request submitted:', locationRequest);
    // Reset form
    setLocationRequest({
      location: '',
      serviceType: '',
      description: '',
      email: '',
      phone: ''
    });
    setShowLocationForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ServiceBanner/>
      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Construction Services for You
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover expert professionals ready to bring your vision to life
            </p>
          </div>
          
          <div className="">
           <input
            type="text"
            placeholder="Search for a service"
            className="w-1/2 p-2 mx-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <ServiceGrid searchQuery={searchQuery} />
          </div>
        </div>
      </section>

      {/* Location Request Modal/Section */}
      {showLocationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Request Custom Services
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Can&apos;t find what you&apos;re looking for? We&apos;ll connect you with the right professional.
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLocationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLocationRequest} className="space-y-4">
                <div>
                  <Label htmlFor="location">Your Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State or ZIP Code"
                    value={locationRequest.location}
                    onChange={(e) => setLocationRequest(prev => ({ ...prev, location: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    placeholder="e.g., Custom Home Design, Commercial Architecture"
                    value={locationRequest.serviceType}
                    onChange={(e) => setLocationRequest(prev => ({ ...prev, serviceType: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us more about your project needs..."
                    value={locationRequest.description}
                    onChange={(e) => setLocationRequest(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={locationRequest.email}
                      onChange={(e) => setLocationRequest(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={locationRequest.phone}
                      onChange={(e) => setLocationRequest(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Submit Request
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowLocationForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <TrustSecurity/>
    </div>
  );
}