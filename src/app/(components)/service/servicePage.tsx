"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/app/hooks/useTranslations";
// SpecialistLocator not used on this page currently
import { usePortfolio } from "@/app/hooks/usePortfolio";
import { Portfolio } from "@/app/services/porfolioService";
import { formatPortfolioDate, formatDetailedDate } from '@/lib/dateUtils';
 

const ServicePage = () => {
  const { t } = useTranslations();
  const { searchPublic, loading, error } = usePortfolio();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("q") || "";

  const [items, setItems] = useState<Portfolio[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [professionalType, setProfessionalType] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Update search term when URL params change
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return items.filter((p) => {
      const searchMatch =
        searchTerm === "" ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch =
        categoryFilter === "all" || (p.category || "").toLowerCase().includes(categoryFilter.toLowerCase());

      const locationMatch =
        locationFilter === "" || (p.location || "").toLowerCase().includes(locationFilter.toLowerCase());

      return searchMatch && categoryMatch && locationMatch;
    });
  }, [items, searchTerm, categoryFilter, locationFilter]);

  useEffect(() => {
    const category = categoryFilter === "all" ? undefined : categoryFilter;
    searchPublic({ category, location: locationFilter || undefined, professionalType: professionalType as any, page, limit })
      .then(({ items }) => setItems(items))
      .catch(() => setItems([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, locationFilter, professionalType, page, limit]);

  // Unused UI pieces removed from original mock: status filter, budget slider, bidding modal

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "Rwf",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <DefaultPageBanner
          title={t("projects.title")}
          backgroundImage="/store-img.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              <span className="text-amber-800">
                {t("common.loading")} {t("projects.title").toLowerCase()}...
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DefaultPageBanner
          title={t("projects.title")}
          backgroundImage="/store-img.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              {t("common.error")} {t("projects.title")}
            </h3>
            <p className="text-amber-800">{t("projects.errorTryAgain")}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Sidebar Filters */}
        <div className="w-80 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <h3 className="font-semibold">Filter Projects</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search within filters..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="commercial construction">
                      Commercial Construction
                    </SelectItem>
                    <SelectItem value="residential construction">
                      Residential Construction
                    </SelectItem>
                    <SelectItem value="industrial construction">
                      Industrial Construction
                    </SelectItem>
                    <SelectItem value="healthcare construction">
                      Healthcare Construction
                    </SelectItem>
                    <SelectItem value="educational construction">
                      Educational Construction
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm font-medium">Location</Label>
                </div>
                <Input
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              {/* Additional filters can go here (e.g., price range) */}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {filteredItems.map((p) => (
            <Card
              key={p.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={p.category?.toLowerCase() === "commercial" ? "default" : "secondary"}
                      >
                        {p.category || 'General'}
                      </Badge>
                      <Badge
                        variant={p.isPublic ? "default" : "outline"}
                        className={p.isPublic ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}
                      >
                        {p.isPublic ? 'Visible' : 'Invisible'}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{p.title}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      P
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{p.description}</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{p.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatPortfolioDate(p.workDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-green-600">{p.budget || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium text-green-600">{p.duration || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{(p.images?.length ?? 0)} Photos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 ${p.isPublic ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                      <span className={`text-sm ${p.isPublic ? 'text-green-700' : 'text-red-700'}`}>{p.isPublic ? 'Visible' : 'Invisible'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2" onClick={() => router.push(`/portfolios/${p.id}`)}>
                      <span>View Details</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Project-related modals removed in portfolio view */}
    </div>
  );
}
export default ServicePage;