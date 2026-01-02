"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type UserRoleOption =
  | "Any"
  | "Seller"
  | "Architect"
  | "Contractor"
  | "Plumber"
  | "Technician";

interface MatchResultItem {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  businessName?: string | null;
  profilePic?: string | null;
  score?: number | null;
  avgRating?: number | null;
  totalReviews?: number | null;
  experience?: number | null;
  isActive?: boolean | null;
  architectId?: string | null;
  contractorId?: string | null;
  technicianId?: string | null;
  sellerId?: string | null;
}

const roleOptions: UserRoleOption[] = [
  "Any",
  "Seller",
  "Architect",
  "Contractor",
  "Plumber",
  "Technician",
];

export default function ProjectProfessionalsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const [selectedRole, setSelectedRole] = useState<UserRoleOption>("Any");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResultItem[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<MatchResultItem | null>(null);
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat?: number;
    lng?: number;
    street?: string;
    district?: string;
    province?: string;
    country?: string;
  }>({});

  const openProDetails = (item: MatchResultItem) => {
    setSelectedPro(item);
    setPortfolio(null);
    setPortfolioError(null);
    loadPortfolio(item);
  };

  const loadPortfolio = async (item: MatchResultItem) => {
    setPortfolioLoading(true);
    setPortfolioError(null);
    try {
      const authToken =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      if (!authToken) {
        setPortfolioError("Authentication required");
        return;
      }

      let portfolioUrl = "";
      if (item.architectId) {
        portfolioUrl = `${API_URL}/api/v1/architects/${item.architectId}/portfolios`;
      } else if (item.contractorId) {
        portfolioUrl = `${API_URL}/api/v1/contractors/${item.contractorId}/portfolios`;
      } else if (item.technicianId) {
        portfolioUrl = `${API_URL}/api/v1/technicians/${item.technicianId}/portfolios`;
      } else if (item.sellerId) {
        // Sellers might not have portfolios, skip for now
        setPortfolioLoading(false);
        return;
      } else {
        setPortfolioLoading(false);
        return;
      }

      const res = await fetch(portfolioUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load portfolio: ${res.status}`);
      }

      const data = await res.json();
      setPortfolio(data);
    } catch (e: unknown) {
      setPortfolioError(
        e instanceof Error ? e.message : "Failed to load portfolio"
      );
    } finally {
      setPortfolioLoading(false);
    }
  };

  const openImagePreview = (images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const goPrevImage = () => {
    setPreviewIndex((i) => (i - 1 + previewImages.length) % previewImages.length);
  };

  const goNextImage = () => {
    setPreviewIndex((i) => (i + 1) % previewImages.length);
  };

  const handleLocateMe = async () => {
    setLocateError(null);
    if (!("geolocation" in navigator)) {
      const msg = "Geolocation is not supported by your browser.";
      setLocateError(msg);
      return;
    }
    setLocating(true);
    try {
      const position: GeolocationPosition = await new Promise(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          });
        }
      );
      const { latitude, longitude } = position.coords;

      setLocation((prev) => ({
        ...prev,
        lat: latitude,
        lng: longitude,
      }));

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        latitude
      )}&lon=${encodeURIComponent(longitude)}&addressdetails=1`;
      const resp = await fetch(url, {
        headers: {
          accept: "application/json",
          "User-Agent": "Construct-KVV/1.0 (professionals reverse geocode)",
          referer: typeof window !== "undefined" ? window.location.origin : "",
        } as any,
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Reverse geocoding failed (${resp.status})`);
      }
      const data = await resp.json();
      const address: Record<string, string | undefined> = data?.address || {};
      const country = address.country || "";
      const province = address.state || "";
      const district = (address.county || "").replace(/District/i, "").trim();
      const street = address.road || "";

      setLocation((prev) => ({
        ...prev,
        ...(country && { country }),
        ...(province && { province }),
        ...(district && { district }),
        ...(street && { street }),
      }));
    } catch (err: unknown) {
      let message = "Failed to get your location.";
      if (err && typeof err === "object" && "code" in (err as any)) {
        const e = err as GeolocationPositionError;
        if (e.code === e.PERMISSION_DENIED) {
          message =
            "Permission denied. Please allow location access and try again.";
        } else if (e.code === e.POSITION_UNAVAILABLE) {
          message =
            "Location information is unavailable. Check your network or GPS.";
        } else if (e.code === e.TIMEOUT) {
          message =
            "Location request timed out. Try again from an area with better signal.";
        } else {
          message = (e as any).message || message;
        }
      } else if (err instanceof Error) {
        message = err.message || message;
      }
      setLocateError(message);
    } finally {
      setLocating(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setApiError(null);
    setValidationError(null);
    try {
      // Require either coordinates (lat & lng) OR a district per backend rules
      const hasCoords =
        typeof location?.lat === "number" &&
        typeof location?.lng === "number";
      const hasDistrict =
        !!location?.district && location?.district.trim().length > 0;
      if (!hasCoords && !hasDistrict) {
        setValidationError(
          "Please provide either coordinates (use 'Locate Me' button) or enter a district."
        );
        setLoading(false);
        return;
      }

      const authToken =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      const payload: any = {};
      if (selectedRole && selectedRole !== "Any") {
        payload.role = selectedRole;
      }

      // Add location to payload
      const cleanedLoc: Record<string, any> = {};
      if (typeof location.lat === "number") cleanedLoc.lat = location.lat;
      if (typeof location.lng === "number") cleanedLoc.lng = location.lng;
      if (location.street) cleanedLoc.street = location.street;
      if (location.district) cleanedLoc.district = location.district;
      if (location.province) cleanedLoc.province = location.province;
      if (location.country) cleanedLoc.country = location.country;
      if (Object.keys(cleanedLoc).length > 0) {
        payload.location = cleanedLoc;
      }

      const res = await fetch(`${API_URL}/api/v1/match`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      const data = await res.json();
      const normalized: MatchResultItem[] = Array.isArray(data?.results)
        ? data.results
            .map((r: any) => ({
              userId: r.userId || r.id || "",
              name:
                r.name ||
                `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() ||
                "Unknown",
              email: r.email || r.user?.email || "",
              phone: r.phone ?? r.user?.phone ?? null,
              role: r.role || r.user?.role || selectedRole || "",
              businessName: r.businessName ?? null,
              profilePic: r.profilePic ?? r.user?.profilePic ?? null,
              score: typeof r.score === "number" ? r.score : null,
              avgRating: typeof r.avgRating === "number" ? r.avgRating : null,
              totalReviews:
                typeof r.totalReviews === "number" ? r.totalReviews : null,
              experience:
                typeof r.experience === "number"
                  ? r.experience
                  : typeof r.user?.experience === "number"
                  ? r.user.experience
                  : null,
              isActive:
                typeof r.isActive === "boolean"
                  ? r.isActive
                  : typeof r.user?.isActive === "boolean"
                  ? r.user.isActive
                  : null,
              architectId: r.architectId ?? r.user?.architectId ?? null,
              contractorId: r.contractorId ?? r.user?.contractorId ?? null,
              technicianId: r.technicianId ?? r.user?.technicianId ?? null,
              sellerId: r.sellerId ?? r.user?.sellerId ?? null,
            }))
            .sort((a, b) => {
              // Sort by score from best to lowest
              const scoreA = a.score ?? 0;
              const scoreB = b.score ?? 0;
              return scoreB - scoreA;
            })
        : [];

      setResults(normalized);
      if (normalized.length === 0) {
        toast.info("No professionals found for your selection");
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error";
      setApiError(errorMessage);
      toast.error(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${projectId}/boq`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to BOQ
          </Button>
          <h1 className="text-3xl font-bold mb-2">Find Professionals</h1>
          <p className="text-gray-600">
            Connect with experienced professionals for your project
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full bg-white rounded-xl shadow p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">
              What type of professional are you looking for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-3 border rounded-lg text-left transition ${
                    selectedRole === role
                      ? "border-amber-500 bg-amber-50 text-amber-900"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-4 mt-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="mb-3">
              <Button
                type="button"
                onClick={handleLocateMe}
                disabled={locating}
                variant="outline"
                className="border-amber-400 text-amber-700 hover:bg-amber-50"
              >
                {locating ? (
                  <>
                    <span className="mr-2 inline-block w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    Locating...
                  </>
                ) : (
                  "📍 Locate Me"
                )}
              </Button>
            </div>
            {locateError && (
              <div className="mb-3 p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-sm">
                {locateError}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Street (optional)"
                  value={location?.street || ""}
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="District *"
                  value={location?.district || ""}
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      district: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Province (optional)"
                  value={location?.province || ""}
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      province: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Country (optional)"
                  value={location?.country || ""}
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (optional)"
                  value={
                    typeof location?.lat === "number"
                      ? String(location.lat)
                      : ""
                  }
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      lat: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (optional)"
                  value={
                    typeof location?.lng === "number"
                      ? String(location.lng)
                      : ""
                  }
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      lng: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Either use "Locate Me" button or enter a district manually
            </p>
          </div>

          {validationError && (
            <div className="mb-4 p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-sm">
              {validationError}
            </div>
          )}
          {apiError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 border border-red-200 text-sm">
              {apiError}
            </div>
          )}
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          >
            {loading ? "Searching..." : "Search Professionals"}
          </Button>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              Matched Professionals ({results.length})
            </h3>
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-auto pr-1">
              {results.map((item) => (
                <div
                  key={item.userId}
                  role="button"
                  tabIndex={0}
                  onClick={() => openProDetails(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openProDetails(item);
                    }
                  }}
                  className="border rounded-lg p-4 bg-white w-full cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.profilePic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.profilePic}
                          alt={item.name}
                          className="w-16 h-16 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold border border-amber-200 text-lg">
                          {String(item.name || "")
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((s) => s.charAt(0).toUpperCase())
                            .join("") || "--"}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-amber-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <span>{item.role}</span>
                          {item?.isActive ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                              Available
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {typeof item.score === "number" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        Score: {item.score}
                      </span>
                    )}
                  </div>
                  {item.businessName && (
                    <div className="text-sm text-gray-700 mt-2">
                      {item.businessName}
                    </div>
                  )}
                  <div className="text-sm text-gray-700 mt-1">{item.email}</div>
                  {item.phone && (
                    <div className="text-sm text-gray-700">{item.phone}</div>
                  )}
                  {typeof item.experience === "number" && (
                    <div className="text-xs text-gray-500 mt-1">
                      Experience: {item.experience} years
                    </div>
                  )}
                  {(typeof item.avgRating === "number" ||
                    typeof item.totalReviews === "number") && (
                    <div className="text-xs text-gray-500 mt-1">
                      Rating: {item.avgRating ?? "-"} ({item.totalReviews ?? 0}{" "}
                      reviews)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Details Modal */}
        {selectedPro && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-[900px] h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
              <div className="relative">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedPro.role === "Seller"
                          ? "Seller Professional Details"
                          : "Professional Details"}
                      </h3>
                      <p className="text-sm text-amber-100">
                        {(selectedPro.role || "").toString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPro(null)}
                      className="ml-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30"
                      aria-label="Close"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-5 h-5 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start gap-4">
                    {selectedPro.profilePic ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedPro.profilePic}
                        alt={selectedPro.name}
                        className="w-20 h-20 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold border border-amber-200 text-xl">
                        {String(selectedPro.name || "")
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((s) => s.charAt(0).toUpperCase())
                          .join("") || "--"}
                      </div>
                    )}
                    <div>
                      <div className="text-lg font-semibold text-amber-900">
                        {selectedPro.name}
                      </div>
                      <div className="text-sm text-gray-700">
                        {selectedPro.email}
                      </div>
                      {selectedPro.phone ? (
                        <div className="text-sm text-gray-700">
                          {selectedPro.phone}
                        </div>
                      ) : null}
                      {(typeof selectedPro.avgRating === "number" ||
                        typeof selectedPro.totalReviews === "number") && (
                        <div className="text-xs text-gray-600 mt-1">
                          Rating: {selectedPro.avgRating ?? "-"} (
                          {selectedPro.totalReviews ?? 0} reviews)
                        </div>
                      )}
                      <div className="mt-3 flex gap-3">
                        {selectedPro.email ? (
                          <a
                            href={`mailto:${selectedPro.email}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-sm"
                          >
                            Contact Email
                          </a>
                        ) : null}
                        {selectedPro.phone ? (
                          <a
                            href={`tel:${selectedPro.phone}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-sm"
                          >
                            Call
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm md:flex-1">
                    {typeof selectedPro.experience === "number" ? (
                      <div className="p-3 rounded-lg border bg-gray-50">
                        <div className="text-gray-500">Experience</div>
                        <div className="font-medium">
                          {selectedPro.experience} years
                        </div>
                      </div>
                    ) : null}
                    {selectedPro.businessName ? (
                      <div className="p-3 rounded-lg border bg-gray-50">
                        <div className="text-gray-500">Business Name</div>
                        <div className="font-medium">
                          {selectedPro.businessName}
                        </div>
                      </div>
                    ) : null}
                    {typeof selectedPro.score === "number" ? (
                      <div className="p-3 rounded-lg border bg-gray-50">
                        <div className="text-gray-500">Match Score</div>
                        <div className="font-medium">{selectedPro.score}</div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Portfolio Section - Only for non-sellers */}
                {selectedPro.role !== "Seller" && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-amber-900">
                        Portfolio
                      </h4>
                      {portfolioLoading ? (
                        <span className="inline-flex items-center text-sm text-gray-600">
                          <span className="mr-2 inline-block w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </span>
                      ) : null}
                    </div>
                    {portfolioError ? (
                      <div className="p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-sm">
                        {portfolioError}
                      </div>
                    ) : null}
                    {!portfolioLoading && !portfolioError ? (
                      <div>
                        {Array.isArray(portfolio?.data) &&
                        portfolio.data.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {portfolio.data.map((proj: any, idx: number) => (
                              <div
                                key={idx}
                                className="border rounded-lg overflow-hidden shadow-sm"
                              >
                                <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3">
                                  <div className="font-semibold text-amber-900">
                                    {proj.title || "Untitled Project"}
                                  </div>
                                  {proj.category ? (
                                    <div className="text-xs text-amber-700">
                                      {proj.category}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="p-4 space-y-2 text-sm">
                                  {proj.description ? (
                                    <p className="text-gray-700">
                                      {proj.description}
                                    </p>
                                  ) : null}
                                  {Array.isArray(proj.images) &&
                                  proj.images.length > 0 ? (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                      {proj.images.map((img: string, i: number) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          key={i}
                                          src={img}
                                          alt={`Portfolio image ${i + 1}`}
                                          className="w-full h-24 object-cover rounded cursor-zoom-in hover:opacity-90"
                                          onClick={() =>
                                            openImagePreview(proj.images, i)
                                          }
                                        />
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-600">
                            No portfolio available.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewOpen && (
          <div
            className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Close preview"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center">
              <button
                type="button"
                aria-label="Previous image"
                onClick={goPrevImage}
                className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
              >
                ‹
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImages[previewIndex]}
                alt={`Preview ${previewIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
              />
              <button
                type="button"
                aria-label="Next image"
                onClick={goNextImage}
                className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
              >
                ›
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white bg-black/40 px-2 py-1 rounded">
                {previewIndex + 1} / {previewImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

