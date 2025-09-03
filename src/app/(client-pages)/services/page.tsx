"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { ServiceGrid } from '@/app/(components)/service/service-grid';
import { useEffect, useState } from 'react';
import { architectService, Architect } from '@/app/services/architectService';
import { constructorService, Constructor } from '@/app/services/constructorService';
import { technicianService, Technician } from '@/app/services/technicianService';
import { serviceService } from '@/app/services/serviceServices';
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
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [svc, architects, contractors, technicians] = await Promise.all([
          serviceService.getServices().catch(() => []),
          architectService.getApprovedArchitects().catch(() => []),
          constructorService.getApprovedContractors().catch(() => []),
          technicianService.getApprovedTechnicians().catch(() => []),
        ]);
        console.log('✅ ARCHITECTS:', architects);
        console.log('✅ CONTRACTORS:', contractors);
        console.log('✅ TECHNICIANS:', technicians);

        const architectList: Architect[] = Array.isArray(architects)
          ? (architects as Architect[])
          : ((architects as any)?.data ?? []);
        const contractorList: Constructor[] = Array.isArray(contractors)
          ? (contractors as Constructor[])
          : ((contractors as any)?.data ?? []);
        const technicianList: Technician[] = Array.isArray(technicians)
          ? (technicians as Technician[])
          : ((technicians as any)?.data ?? []);

        const normalizedArchitects = architectList.map((a) => ({
          id: `architect-${a.id}`,
          title: a.businessName || `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim() || 'Architect',
          provider: { name: `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim() || 'Architect' },
          gallery: a.user?.profilePic ? [a.user.profilePic] : [],
          pricing: undefined,
          location: { city: a.location?.[0] || '' },
          features: [
            'Role: Architect',
            ...(a.licenseNumber ? ["License: " + a.licenseNumber] : []),
            `Experience: ${a.yearsExperience || 0}y`,
          ],
        }));

        const normalizedContractors = contractorList.map((c) => ({
          id: `contractor-${c.id}`,
          title: c.businessName || `${(c as any).firstName || ''} ${(c as any).lastName || ''}`.trim() || 'Contractor',
          provider: { name: `${(c as any).firstName || ''} ${(c as any).lastName || ''}`.trim() || 'Contractor' },
          gallery: (c as any).user?.profilePic ? [(c as any).user.profilePic] : [],
          pricing: undefined,
          location: { city: c.location?.[0] || '' },
          features: [
            'Role: Contractor',
            ...(c.licenseNumber ? ["License: " + c.licenseNumber] : []),
            `Experience: ${c.yearsExperience || 0}y`,
          ],
        }));

        const normalizedTechnicians = technicianList.map((t) => ({
          id: `technician-${t.id}`,
          title: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || 'Technician',
          provider: { name: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || 'Technician' },
          gallery: t.user?.profilePic ? [t.user.profilePic] : [],
          pricing: undefined,
          location: { city: t.location?.[0] || '' },
          features: [
            'Role: Technician',
            ...(Array.isArray(t.categories) ? t.categories.slice(0, 3) : []),
            `Experience: ${t.experience || 0}y`,
          ],
        }));

        setItems([
          ...(Array.isArray(svc) ? svc : []),
          ...normalizedArchitects,
          ...normalizedContractors,
          ...normalizedTechnicians,
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
          <ServiceGrid searchQuery={searchQuery} services={items} loading={loading} />
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