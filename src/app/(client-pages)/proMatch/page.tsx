"use client";
import React from "react";

type UserRoleOption =
  | "Any"
  | "Seller"
  | "Architect"
  | "Contractor"
  | "Plumber"
  | "Technician";
type DesignRequestType =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "LANDSCAPE"
  | "INTERIOR"
  | "URBAN_PLANNING"
  | "RENOVATION"
  | "SUSTAINABLE"
  | "LUXURY"
  | "AFFORDABLE";
type TechnicianCategory =
  | "MASON_BRICKLAYER"
  | "CARPENTER"
  | "CONCRETE_SPECIALIST"
  | "ROOFING_TECHNICIAN"
  | "PAINTER_DECORATOR"
  | "PLASTERER_DRYWALL"
  | "TILE_FLOORING_SPECIALIST"
  | "WALLPAPER_INSTALLER"
  | "WELDER_METAL_FABRICATOR"
  | "GLASS_ALUMINUM_TECHNICIAN"
  | "LOCKSMITH"
  | "INSULATION_INSTALLER"
  | "LANDSCAPER_GARDENING"
  | "PAVING_ROADWORK"
  | "FENCING_INSTALLER"
  | "HANDYMAN"
  | "PEST_CONTROL"
  | "WATER_PUMP_BOREHOLE";

interface MatchRequestBodyBase {
  role?: UserRoleOption;
  serviceType?: string;
  location?: {
    lat?: number;
    lng?: number;
    street?: string;
    district?: string;
    province?: string;
    country?: string;
  };
  desiredDate?: string;
  budget?: number;
  minExperience?: number;
}

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

const DESIGN_TYPES: DesignRequestType[] = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "LANDSCAPE",
  "INTERIOR",
  "URBAN_PLANNING",
  "RENOVATION",
  "SUSTAINABLE",
  "LUXURY",
  "AFFORDABLE",
];

const TECHNICIAN_CATEGORIES: TechnicianCategory[] = [
  "MASON_BRICKLAYER",
  "CARPENTER",
  "CONCRETE_SPECIALIST",
  "ROOFING_TECHNICIAN",
  "PAINTER_DECORATOR",
  "PLASTERER_DRYWALL",
  "TILE_FLOORING_SPECIALIST",
  "WALLPAPER_INSTALLER",
  "WELDER_METAL_FABRICATOR",
  "GLASS_ALUMINUM_TECHNICIAN",
  "LOCKSMITH",
  "INSULATION_INSTALLER",
  "LANDSCAPER_GARDENING",
  "PAVING_ROADWORK",
  "FENCING_INSTALLER",
  "HANDYMAN",
  "PEST_CONTROL",
  "WATER_PUMP_BOREHOLE",
];

export default function ProMatchPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const [results, setResults] = React.useState<MatchResultItem[]>([]);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(
    null
  );
  const [locating, setLocating] = React.useState(false);
  const [locateError, setLocateError] = React.useState<string | null>(null);
  const [selectedPro, setSelectedPro] = React.useState<MatchResultItem | null>(
    null
  );
  const [portfolio, setPortfolio] = React.useState<any | null>(null);
  const [portfolioLoading, setPortfolioLoading] = React.useState(false);
  const [portfolioError, setPortfolioError] = React.useState<string | null>(
    null
  );
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);

  const [form, setForm] = React.useState<MatchRequestBodyBase>({
    role: "Any",
    serviceType: undefined,
    location: {
      district: "",
      province: "",
      country: "",
    },
    desiredDate: "",
    budget: undefined,
    minExperience: undefined,
  });

  const roleOptions: UserRoleOption[] = [
    "Any",
    "Seller",
    "Architect",
    "Contractor",
    "Plumber",
    "Technician",
  ];

  const totalSteps = 6;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleLocateMe = async () => {
    // eslint-disable-next-line no-console
    console.log("[ProMatch] Locate Me button clicked");
    setLocateError(null);
    if (!("geolocation" in navigator)) {
      const msg = "Geolocation is not supported by your browser.";
      setLocateError(msg);
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Geolocation not supported");
      return;
    }
    setLocating(true);
    // eslint-disable-next-line no-console
    console.log("[ProMatch] Starting geolocation...");
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
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Coordinates retrieved:", { latitude, longitude });

      setForm((prev) => ({
        ...prev,
        location: { ...(prev.location || {}), lat: latitude, lng: longitude },
      }));
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Set location.lat and location.lng");

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        latitude
      )}&lon=${encodeURIComponent(longitude)}&addressdetails=1`;
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Fetching reverse geocoding:", url);
      const resp = await fetch(url, {
        headers: {
          accept: "application/json",
          // Nominatim usage policy recommends a descriptive User-Agent
          "User-Agent": "Construct-KVV/1.0 (proMatch reverse geocode)",
          referer: typeof window !== "undefined" ? window.location.origin : "",
        } as any,
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Reverse geocoding failed (${resp.status})`);
      }
      const data = await resp.json();
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Reverse geocoding response:", data);

      const address: Record<string, string | undefined> = data?.address || {};
      const country = address.country || "";
      const province = address.state || ""; // Province from state
      const district = (address.county || "").replace(/District/i, "").trim();
      const street = address.road || "";

      if (country) {
        setForm((prev) => ({
          ...prev,
          location: { ...(prev.location || {}), country },
        }));
        // eslint-disable-next-line no-console
        console.log("[ProMatch] Populated country:", country);
      }
      if (province) {
        setForm((prev) => ({
          ...prev,
          location: { ...(prev.location || {}), province },
        }));
        // eslint-disable-next-line no-console
        console.log("[ProMatch] Populated province (state):", province);
      }
      if (district) {
        setForm((prev) => ({
          ...prev,
          location: { ...(prev.location || {}), district },
        }));
        // eslint-disable-next-line no-console
        console.log("[ProMatch] Populated district/city:", district);
      }
      if (street) {
        setForm((prev) => ({
          ...prev,
          location: { ...(prev.location || {}), street },
        }));
        // eslint-disable-next-line no-console
        console.log("[ProMatch] Populated street (road):", street);
      }
      // Explicit logs for lat/lng already set earlier
      // eslint-disable-next-line no-console
      console.log(
        "[ProMatch] Confirm lat/lng populated:",
        latitude.toFixed(6),
        longitude.toFixed(6)
      );
    } catch (err: unknown) {
      let message = "Failed to get your location.";
      if (
        typeof window !== "undefined" &&
        "GeolocationPositionError" in window
      ) {
        // no-op, type guard for older TS targets
      }
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
          message = e.message || message;
        }
      } else if (err instanceof Error) {
        message = err.message || message;
      }
      setLocateError(message);
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Locate Me error:", err);
    } finally {
      setLocating(false);
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Geolocation flow finished");
    }
  };

  const openProDetails = async (pro: MatchResultItem) => {
    setSelectedPro(pro);
    setPortfolio(null);
    setPortfolioError(null);
    setPortfolioLoading(true);
    // eslint-disable-next-line no-console
    console.log("[ProMatch] Opening details for:", pro);
    try {
      const archId = pro.architectId || null;
      const contId = pro.contractorId || null;
      const roleLower = (pro.role || "").toLowerCase();
      // eslint-disable-next-line no-console
      console.log(
        "[ProMatch] Preparing to fetch portfolio (by role-specific IDs):",
        {
          architectId: archId,
          contractorId: contId,
          technicianId: pro.technicianId || null,
          sellerId: pro.sellerId || null,
          role: pro.role,
        }
      );
      let endpoint = "";
      if (archId && roleLower.includes("architect")) {
        endpoint = `${API_URL}/api/v1/portfolio/public/architect/${encodeURIComponent(
          archId
        )}`;
        // eslint-disable-next-line no-console
        console.log(
          "[ProMatch] Role detected: architect. Using architect endpoint."
        );
      } else if (contId && roleLower.includes("contractor")) {
        endpoint = `${API_URL}/api/v1/portfolio/public/contractor/${encodeURIComponent(
          contId
        )}`;
        // eslint-disable-next-line no-console
        console.log(
          "[ProMatch] Role detected: contractor. Using contractor endpoint."
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(
          "[ProMatch] Missing architectId/contractorId or unsupported role; skipping portfolio fetch"
        );
        setPortfolioLoading(false);
        return;
      }
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Fetching portfolio:", endpoint);
      const res = await fetch(endpoint, {
        headers: { accept: "application/json" },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch portfolio (${res.status})`);
      }
      const data = await res.json();
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Portfolio response:", data);
      setPortfolio(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown portfolio error";
      setPortfolioError(msg);
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Portfolio error:", e);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const openImagePreview = (images: string[], index: number) => {
    if (!Array.isArray(images) || images.length === 0) return;
    setPreviewImages(images);
    setPreviewIndex(Math.max(0, Math.min(index, images.length - 1)));
    setPreviewOpen(true);
  };

  const goPrevImage = () => {
    setPreviewIndex(
      (i) => (i - 1 + previewImages.length) % previewImages.length
    );
  };

  const goNextImage = () => {
    setPreviewIndex((i) => (i + 1) % previewImages.length);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError(null);
    setValidationError(null);
    try {
      // Require either coordinates (lat & lng) OR a district per backend rules
      const hasCoords =
        typeof form.location?.lat === "number" &&
        typeof form.location?.lng === "number";
      const hasDistrict =
        !!form.location?.district && form.location?.district.trim().length > 0;
      if (!hasCoords && !hasDistrict) {
        setValidationError(
          "Please provide either coordinates (lat & lng) or a district."
        );
        setStep(2);
        setSubmitting(false);
        return;
      }

      const payload: MatchRequestBodyBase = {};
      if (form.role && form.role !== "Any") payload.role = form.role;
      // Do not include serviceType in the API payload; it's UI-only.
      if (form.desiredDate) payload.desiredDate = form.desiredDate;
      if (typeof form.budget === "number" && !Number.isNaN(form.budget))
        payload.budget = form.budget;
      if (
        typeof form.minExperience === "number" &&
        !Number.isNaN(form.minExperience)
      )
        payload.minExperience = form.minExperience;
      const loc = form.location || {};
      const cleanedLoc: Record<string, any> = {};
      if (typeof loc.lat === "number") cleanedLoc.lat = loc.lat;
      if (typeof loc.lng === "number") cleanedLoc.lng = loc.lng;
      if (loc.street) cleanedLoc.street = loc.street;
      if (loc.district) cleanedLoc.district = loc.district;
      if (loc.province) cleanedLoc.province = loc.province;
      if (loc.country) cleanedLoc.country = loc.country;
      if (Object.keys(cleanedLoc).length > 0)
        payload.location = cleanedLoc as any;

      const authToken =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      // Debug: log submitted payload
      try {
        // eslint-disable-next-line no-console
        console.log(
          "[ProMatch] Submitting match payload:",
          JSON.stringify(payload)
        );
      } catch {
        // eslint-disable-next-line no-console
        console.log("[ProMatch] Submitting match payload (raw):", payload);
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
      // Debug: log raw API response
      // eslint-disable-next-line no-console
      console.log("[ProMatch] Match API response:", data);
      const normalized: MatchResultItem[] = Array.isArray(data?.results)
        ? data.results.map((r: any) => ({
            userId: r.userId || r.id || "",
            name:
              r.name ||
              `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() ||
              "Unknown",
            email: r.email || r.user?.email || "",
            phone: r.phone ?? r.user?.phone ?? null,
            role: r.role || r.user?.role || form.role || "",
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
        : [];
      setResults(normalized);
      setResultsOpen(true);
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : "Unknown error");
      setResults([]);
      setResultsOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4">
      <h1 className="text-title font-bold mb-2">Find Your Pro Match</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Answer a few questions and we will match you with the best
        professionals.
      </p>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
        <div className="mb-6 text-small text-gray-500">
          Step {step + 1} of {totalSteps}
        </div>
        {validationError && (
          <div className="mb-4 p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-small">
            {validationError}
          </div>
        )}

        {step === 0 && (
          <div>
            <h2 className="text-mid font-semibold mb-4">
              What type of pro are you looking for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: r }))}
                  className={`px-4 py-3 border rounded-lg text-left ${
                    form.role === r
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-mid font-semibold mb-4">
              Select a service type
            </h2>
            {form.role === "Architect" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DESIGN_TYPES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, serviceType: d }))
                    }
                    className={`px-4 py-3 border rounded-lg text-left ${
                      form.serviceType === d
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {d.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            )}
            {form.role === "Technician" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-auto pr-1">
                {TECHNICIAN_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, serviceType: c }))
                    }
                    className={`px-4 py-3 border rounded-lg text-left ${
                      form.serviceType === c
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {c.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            )}
            {(form.role === "Any" ||
              form.role === "Contractor" ||
              form.role === "Plumber") && (
              <div>
                <input
                  type="text"
                  placeholder="e.g., House build, Renovation, Plumbing repair"
                  value={form.serviceType || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, serviceType: e.target.value }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-small text-gray-500 mt-1">
                  Optional. If left empty, we will still match by role.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-mid font-semibold mb-4">
              Where is the job located?
            </h2>
            <div className="mb-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-small text-gray-600">
                Provide an address or let us detect your location.
              </p>
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={locating}
                className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition disabled:opacity-60"
              >
                {locating ? (
                  <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6l4 2m4-2a8 8 0 11-16 0 8 8 0 0116 0z"
                    />
                  </svg>
                )}
                {locating ? "Locating..." : "Locate Me"}
              </button>
            </div>
            {locateError && (
              <div className="mb-3 p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-small">
                {locateError}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Street (optional)"
                  value={form.location?.street || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      location: {
                        ...(p.location || {}),
                        street: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="District (optional)"
                  value={form.location?.district || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      location: {
                        ...(p.location || {}),
                        district: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Province (optional)"
                  value={form.location?.province || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      location: {
                        ...(p.location || {}),
                        province: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Country (optional)"
                  value={form.location?.country || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      location: {
                        ...(p.location || {}),
                        country: e.target.value,
                      },
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
                    typeof form.location?.lat === "number"
                      ? String(form.location?.lat)
                      : ""
                  }
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      location: {
                        ...(p.location || {}),
                        lat: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (optional)"
                  value={
                    typeof form.location?.lng === "number"
                      ? String(form.location?.lng)
                      : ""
                  }
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      location: {
                        ...(p.location || {}),
                        lng: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-mid font-semibold mb-4">
              When do you need the service?
            </h2>
            <input
              type="date"
              value={form.desiredDate || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, desiredDate: e.target.value }))
              }
              className="px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-small text-gray-500 mt-1">
              Optional. You can skip this.
            </p>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-mid font-semibold mb-4">What is your budget?</h2>
            <input
              type="number"
              min="0"
              placeholder="Enter amount (RWF)"
              value={typeof form.budget === "number" ? String(form.budget) : ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  budget: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-small text-gray-500 mt-1">
              Optional. Helps prioritize suitable pros.
            </p>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-mid font-semibold mb-4">
              Minimum years of experience?
            </h2>
            <input
              type="number"
              min="0"
              placeholder="e.g., 3"
              value={
                typeof form.minExperience === "number"
                  ? String(form.minExperience)
                  : ""
              }
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  minExperience: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
              className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-small text-gray-500 mt-1">
              Optional. Leave empty for no minimum.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || submitting}
            className={`px-4 py-2 rounded-lg border ${
              step === 0
                ? "border-gray-200 text-gray-400"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            Back
          </button>
          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {submitting ? "Matching..." : "Find Matches"}
            </button>
          )}
        </div>
      </div>

      {resultsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-mid font-semibold">Matched Professionals</h3>
              <button
                type="button"
                onClick={() => setResultsOpen(false)}
                className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            {apiError && (
              <div className="mb-4 p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-small">
                {apiError}
              </div>
            )}
            {results.length === 0 ? (
              <div className="text-gray-600">
                No matches found for your criteria.
              </div>
            ) : (
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
                    className="border rounded-lg p-4 bg-white w-full max-w-2xl mx-auto cursor-pointer hover:shadow-md transition"
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
                          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold border border-amber-200 text-mid">
                            {String(item.name || "")
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((s) => s.charAt(0).toUpperCase())
                              .join("") || "--"}
                          </div>
                        )}
                        <div className="font-semibold text-amber-900">
                          {item.name}
                        </div>
                      </div>
                      {typeof item.score === "number" && (
                        <span className="text-small px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                          Score: {item.score}
                        </span>
                      )}
                    </div>
                    <div className="text-small text-gray-600 mt-1 flex items-center gap-2">
                      <span>{item.role}</span>
                      {item?.isActive ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                          Available
                        </span>
                      ) : null}
                    </div>
                    {typeof item.experience === "number" && (
                      <div className="text-small text-gray-500 mt-1">
                        Experience: {item.experience} years
                      </div>
                    )}
                    {item.businessName && (
                      <div className="text-small text-gray-700">
                        {item.businessName}
                      </div>
                    )}
                    <div className="text-small text-gray-700 mt-2">
                      {item.email}
                    </div>
                    {item.phone && (
                      <div className="text-small text-gray-700">{item.phone}</div>
                    )}
                    {(typeof item.avgRating === "number" ||
                      typeof item.totalReviews === "number") && (
                      <div className="text-small text-gray-500 mt-1">
                        Rating: {item.avgRating ?? "-"} (
                        {item.totalReviews ?? 0} reviews)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
                    <h3 className="text-mid font-semibold">
                      Professional Details
                    </h3>
                    <p className="text-small text-amber-100">
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
                    <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold border border-amber-200 text-mid">
                      {String(selectedPro.name || "")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((s) => s.charAt(0).toUpperCase())
                        .join("") || "--"}
                    </div>
                  )}
                  <div>
                    <div className="text-mid font-semibold text-amber-900">
                      {selectedPro.name}
                    </div>
                    <div className="text-small text-gray-700">
                      {selectedPro.email}
                    </div>
                    {selectedPro.phone ? (
                      <div className="text-small text-gray-700">
                        {selectedPro.phone}
                      </div>
                    ) : null}
                    {typeof selectedPro.avgRating === "number" ||
                    typeof selectedPro.totalReviews === "number" ? (
                      <div className="text-small text-gray-600 mt-1">
                        Rating: {selectedPro.avgRating ?? "-"} (
                        {selectedPro.totalReviews ?? 0} reviews)
                      </div>
                    ) : null}
                    <div className="mt-3 flex gap-3">
                      {selectedPro.email ? (
                        <a
                          href={`mailto:${selectedPro.email}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-small"
                        >
                          Contact Email
                        </a>
                      ) : null}
                      {selectedPro.phone ? (
                        <a
                          href={`tel:${selectedPro.phone}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-small"
                        >
                          Call
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-small md:flex-1">
                  {typeof selectedPro.experience === "number" ? (
                    <div className="p-3 rounded-lg border bg-gray-50">
                      <div className="text-gray-500">Experiences</div>
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
                  {/* Placeholder for license/address if provided in future API expansion */}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-mid font-semibold text-amber-900">
                    Portfolio
                  </h4>
                  {portfolioLoading ? (
                    <span className="inline-flex items-center text-small text-gray-600">
                      <span className="mr-2 inline-block w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : null}
                </div>
                {portfolioError ? (
                  <div className="p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-small">
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
                                <div className="text-small text-amber-700">
                                  {proj.category}
                                </div>
                              ) : null}
                            </div>
                            <div className="p-4 space-y-2 text-small">
                              {proj.description ? (
                                <p className="text-gray-700">
                                  {proj.description}
                                </p>
                              ) : null}
                              <div className="grid grid-cols-2 gap-2">
                                {proj.workDate ? (
                                  <div className="text-gray-600">
                                    <span className="text-gray-500">
                                      Work Date:
                                    </span>{" "}
                                    {proj.workDate}
                                  </div>
                                ) : null}
                                {proj.location ? (
                                  <div className="text-gray-600">
                                    <span className="text-gray-500">
                                      Location:
                                    </span>{" "}
                                    {proj.location}
                                  </div>
                                ) : null}
                                {proj.budget ? (
                                  <div className="text-gray-600">
                                    <span className="text-gray-500">
                                      Budget:
                                    </span>{" "}
                                    {proj.budget}
                                  </div>
                                ) : null}
                                {proj.duration ? (
                                  <div className="text-gray-600">
                                    <span className="text-gray-500">
                                      Duration:
                                    </span>{" "}
                                    {proj.duration}
                                  </div>
                                ) : null}
                              </div>
                              {Array.isArray(proj.skills) &&
                              proj.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {proj.skills.map((s: string, i: number) => (
                                    <span
                                      key={i}
                                      className="text-small px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                              {proj.clientFeedback ? (
                                <div className="mt-2 p-2 rounded-md bg-gray-50 border text-gray-700">
                                  <div className="text-small text-gray-500 mb-1">
                                    Client Feedback
                                  </div>
                                  <div>{proj.clientFeedback}</div>
                                </div>
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
            </div>
          </div>
        </div>
      )}
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-small text-white bg-black/40 px-2 py-1 rounded">
              {previewIndex + 1} / {previewImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
