"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, User, Building, MapPin, Clock, MessageSquare } from "lucide-react";
import { useArchitect } from "@/app/hooks/useArchitect";
import { DesignRequest } from "@/app/services/architectService";
import { formatDistanceToNow } from "date-fns";

export default function ArchitectDesignRequests() {
  const [designRequests, setDesignRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getDesignRequests } = useArchitect();

  useEffect(() => {
    const fetchDesignRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const requests = await getDesignRequests();
        setDesignRequests(requests);
      } catch (err: any) {
        setError(err.message || 'Failed to load design requests');
      } finally {
        setLoading(false);
      }
    };

    fetchDesignRequests();
  }, [getDesignRequests]);

  const handleCallCustomer = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmailCustomer = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title font-bold text-gray-900">Design Requests</h1>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 bg-blue-400 ">
        <div className="flex items-center justify-between">
          <h1 className="text-title font-bold text-gray-900">Design Requests</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <MessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-mid font-semibold text-gray-900 mb-2">Error Loading Requests</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (designRequests.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title font-bold text-gray-900">Design Requests</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <MessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-mid font-semibold text-gray-900 mb-2">No Design Requests Yet</h3>
              <p className="text-gray-600">
                You haven't received any design requests yet. When customers request designs from your portfolio, they'll appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-title font-bold text-gray-900">Design Requests</h1>
        <Badge variant="secondary" className="text-small">
          {designRequests.length} {designRequests.length === 1 ? 'Request' : 'Requests'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {designRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow max-w-6xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    {request.customer.firstName} {request.customer.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-small">
                  New Request
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-small">
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {request.customer.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {request.customer.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Portfolio Information */}
                {request.portfolio && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      Portfolio Reference
                    </h4>
                    <div className="space-y-1 text-small">
                      <p className="text-gray-600">
                        <span className="font-medium">Project:</span> {request.portfolio.title}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Description:</span> {request.portfolio.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {request.customer.phone && (
                  <Button 
                    onClick={() => handleCallCustomer(request.customer.phone)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-4 w-4" />
                    Call Customer
                  </Button>
                )}
                
                <Button 
                  onClick={() => handleEmailCustomer(request.customer.email)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>

                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
