import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, DollarSign, Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Filters {
  search?: string;
  category?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  status?: string;
}

interface ProjectFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function ProjectFilters({
  filters,
  onFiltersChange,
}: ProjectFiltersProps) {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Filter Projects</h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search projects..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-small font-medium text-slate-700">Category</label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="renovation">Renovation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-small font-medium text-slate-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <Input
            placeholder="Enter location..."
            value={filters.location || ""}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="border-slate-200 focus:border-orange-300 focus:ring-orange-200"
          />
        </div>

        {/* Budget Range */}
        <div className="space-y-3">
          <label className="text-small font-medium text-slate-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Budget Range
          </label>
          <div className="px-3">
            <Slider
              value={[filters.budgetMin || 0, filters.budgetMax || 1000000]}
              onValueChange={([min, max]) => {
                updateFilter("budgetMin", min);
                updateFilter("budgetMax", max);
              }}
              max={1000000}
              step={10000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-small text-slate-600">
            <span>${(filters.budgetMin || 0).toLocaleString()}</span>
            <span>${(filters.budgetMax || 1000000).toLocaleString()}</span>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-small font-medium text-slate-700">Status</label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open for Bids</SelectItem>
              <SelectItem value="bidding">Active Bidding</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="space-y-2">
            <label className="text-small font-medium text-slate-700">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (
                  !value ||
                  value === "all" ||
                  key === "budgetMin" ||
                  key === "budgetMax"
                )
                  return null;
                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 border-orange-200"
                  >
                    {key}: {value}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
