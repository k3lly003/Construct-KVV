'use client';

import { useState } from 'react';
import { X, MapPin, User, Clock, DollarSign, Users, TrendingUp, FileText, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  timeline: number;
  proposal: string;
  submittedOn: string;
  rating: number;
  completedProjects: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Open' | 'Bidding' | 'Closed';
  type: 'Commercial' | 'Residential' | 'Industrial';
  location: string;
  deadline: string;
  budgetMin: number;
  budgetMax: number;
  timeLeft: number;
  bidCount: number;
  isActive: boolean;
  postedBy: string;
  postedOn: string;
  requirements: string[];
  bids: Bid[];
}

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onPlaceBid: (project: Project) => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose, onPlaceBid }: ProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatBudgetRange = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
      }
      return formatCurrency(amount);
    };
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <DialogTitle className="text-lg font-semibold">Project Details</DialogTitle>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => onPlaceBid(project)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Place Bid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Badge variant={project.type === 'Commercial' ? 'default' : 'secondary'}>
                  {project.type}
                </Badge>
                <Badge 
                  variant={project.status === 'Open' ? 'default' : 'outline'}
                  className={project.status === 'Open' ? 'bg-green-100 text-green-800' : ''}
                >
                  {project.status}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
              <p className="text-gray-600">{project.description}</p>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-600 font-medium">Budget Range</p>
                    <p className="text-lg font-bold text-green-700">
                      {formatBudgetRange(project.budgetMin, project.budgetMax)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-600 font-medium">Time Left</p>
                    <p className="text-lg font-bold text-blue-700">{project.timeLeft} days</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-purple-600 font-medium">Total Bids</p>
                    <p className="text-lg font-bold text-purple-700">{project.bidCount}</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-orange-600 font-medium">Avg Bid</p>
                    <p className="text-lg font-bold text-orange-700">N/A</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="bids">Bids ({project.bidCount})</TabsTrigger>
              </TabsList>

              <div className="mt-6 max-h-96 overflow-y-auto">
                <TabsContent value="overview" className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold">Project Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-medium">{project.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Deadline</p>
                      <p className="font-medium">{project.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Posted By</p>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">{project.postedBy}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Posted On</p>
                      <p className="font-medium">{project.postedOn}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Project Requirements</h3>
                  <div className="space-y-3">
                    {project.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Project Documents</h3>
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No documents available yet.</p>
                  </div>
                </TabsContent>

                <TabsContent value="bids" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Current Bids</h3>
                  {project.bids.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No bids submitted yet.</p>
                      <p className="text-gray-400 text-sm">Be the first to place a bid!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {project.bids
                        .sort((a, b) => a.amount - b.amount)
                        .map((bid, index) => (
                        <Card key={bid.id} className={`border-l-4 ${index === 0 ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{bid.bidderName}</h4>
                                  {index === 0 && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">Lowest Bid</Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <span>⭐</span>
                                    <span>{bid.rating}</span>
                                  </div>
                                  <span>{bid.completedProjects} projects completed</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(bid.amount)}</p>
                                <p className="text-sm text-gray-500">{bid.timeline} months</p>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm mb-3">{bid.proposal}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Submitted on {bid.submittedOn}</span>
                              <Button variant="outline" size="sm">
                                View Full Proposal
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}