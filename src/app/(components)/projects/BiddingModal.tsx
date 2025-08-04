'use client';

import { useState } from 'react';
import { X, DollarSign, Calendar, FileText, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

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

interface BidData {
  amount: string;
  timeline: string;
  proposal: string;
}

interface PlaceBidModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bidData: BidData) => void;
}

export function PlaceBidModal({ project, isOpen, onClose, onSubmit }: PlaceBidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [proposal, setProposal] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: bidAmount,
      timeline: timeline,
      proposal: proposal,
    });
    // Reset form
    setBidAmount('');
    setTimeline('');
    setProposal('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <DialogTitle className="text-lg font-semibold">Place Your Bid</DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Project Summary */}
            <Card className="mb-6 bg-gray-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{formatBudgetRange(project.budgetMin, project.budgetMax)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium">{project.deadline}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bid Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="bidAmount" className="text-sm font-medium text-gray-700">
                  Bid Amount (USD)
                </Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="bidAmount"
                    type="text"
                    placeholder="Enter your bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timeline" className="text-sm font-medium text-gray-700">
                  Completion Timeline (Days)
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="timeline"
                    type="number"
                    placeholder="Enter timeline in days"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="proposal" className="text-sm font-medium text-gray-700">
                  Detailed Proposal
                </Label>
                <Textarea
                  id="proposal"
                  placeholder="Describe your approach, methodology, materials, team, and why you're the best choice for this project..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="mt-2 min-h-32"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include details about your experience, approach, and what sets you apart.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Submit Bid
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}