"use client";

import Head from "next/head";
import { Banner } from "@/app/(components)/home/Banner";
import ServicesShowCaseSection from "@/app/(components)/home/ServicesShowCaseSection";
import { ProjectShowcase } from "@/app/(components)/home/ProjectShowcase";
import { Products } from "@/app/(components)/Product";
import { useEffect, useState, useRef } from "react";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { productService } from "@/app/services/productServices";
import Link from "next/link";
import ProductCard from "@/app/(components)/ProductCard";
import { useTranslations } from "@/app/hooks/useTranslations";
import { dashboardFakes } from "@/app/utils/fakes/DashboardFakes";
import { MdLocationPin } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ProductViewSkeleton } from "@/app/utils/skeleton/ProductSkeletons";

function RecommendedProductsSection() {
  const { t } = useTranslations();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = getUserDataFromLocalStorage();
    setUser(userData);
    if (!userData || !userData.id || !userData.token) {
      setLoading(false);
      setProducts([]);
      return;
    }
    setLoading(true);
    setError(null);
    productService
      .fetchRecommendedProducts(userData.id, userData.token)
      .then((prods) => {
        setProducts(prods);
      })
      .catch((err) => {
        setError("Failed to load recommended products");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">
        {t(dashboardFakes.RecommendationsSection.title) ||
          "Top Picks We Recommend"}
      </h2>
      {loading ? (
        <div className="flex flex-wrap px-4 gap-7 justify-center lg:flex lg:justify-start">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse overflow-hidden w-64 m-2 rounded-xl"
            >
              <div className="w-full h-56 bg-gray-200" />
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : products.length > 0 ? (
        <div className="flex flex-wrap px-4 gap-7 justify-center lg:flex lg:justify-start">
          {products.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-2">
            {t(dashboardFakes.RecommendationsSection.noRecommendations) ||
              "No recommended products available."}
          </p>
          <Link
            href="/product"
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded transition"
          >
            {t(dashboardFakes.RecommendationsSection.seeAllProducts) ||
              "See all products"}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslations();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Service dropdown state - prioritized to align with Smart Match roles
  const serviceOptions = [
    "Contractor",
    "Architect / Design",
    "Plumber",
    "Technician",
    // Common technician and construction specialties
    "Electrician",
    "Carpenter",
    "Mason / Bricklayer",
    "Painter",
    "Roofer",
    "Tiler / Flooring",
    // Additional services
    "Landscaping",
    "Interior Design",
    "HVAC",
    "Cleaning",
    "Security Systems",
    "Glass & Aluminum",
    "Waterproofing",
    "Solar Installation",
    "General Contracting",
    "Project Management",
    "Demolition",
    "Excavation",
    "Welder",
  ];
  const [serviceInput, setServiceInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredServices = serviceOptions.filter((option) =>
    option.toLowerCase().includes(serviceInput.toLowerCase())
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // District dropdown state
  const districtOptions = [
    "Karongi",
    "Ngororero",
    "Nyabihu",
    "Nyamasheke",
    "Rubavu",
    "Rusizi",
    "Rutsiro",
    "Gasabo",
    "Kicukiro",
    "Nyarugenge",
    "Bugesera",
    "Gatsibo",
    "Kayonza",
    "Kirehe",
    "Ngoma",
    "Nyagatare",
    "Rwamagana",
    "Burera",
    "Gakenke",
    "Gicumbi",
    "Musanze",
    "Rulindo",
    "Gisagara",
    "Huye",
    "Kamonyi",
    "Muhanga",
    "Nyamagabe",
    "Nyanza",
    "Nyaruguru",
    "Ruhango",
  ];
  const [districtInput, setDistrictInput] = useState("");
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const districtInputRef = useRef<HTMLInputElement>(null);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  const filteredDistricts = districtOptions.filter((option) =>
    option.toLowerCase().includes(districtInput.toLowerCase())
  );

  // Handle outside click for district dropdown
  useEffect(() => {
    if (!showDistrictDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target as Node) &&
        districtInputRef.current &&
        !districtInputRef.current.contains(event.target as Node)
      ) {
        setShowDistrictDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDistrictDropdown]);

  useEffect(() => {
    const userData = getUserDataFromLocalStorage();
    setUser(userData);
    if (!userData) return;
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        if (userData && userData.id && userData.token) {
          interface ProductRecommendationsResponse {
            recommendations: any[]; // You can replace 'any' with a more specific type for your recommendations
          }
          const res = await productService.fetchRecommendedProducts(
            userData.id,
            userData.token
          );
          setRecommendations(res || []);
        }
      } catch (err: any) {
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Construct KVV | Home</title>
        <meta
          name="description"
          content="Your one-stop solution for construction needs in Rwanda. Shop products, view projects, and connect with KVV Construction."
        />
        <meta property="og:title" content="Construct KVV | Home" />
        <meta
          property="og:description"
          content="Your one-stop solution for construction needs in Rwanda. Shop products, view projects, and connect with KVV Construction."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.constructkvv.com/" />
        <meta property="og:image" content="/kvv-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Construct KVV | Home" />
        <meta
          name="twitter:description"
          content="Your one-stop solution for construction needs in Rwanda."
        />
        <meta name="twitter:image" content="/kvv-logo.png" />
        <link rel="canonical" href="https://www.constructkvv.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "KVV Construction",
              url: "https://www.constructkvv.com/",
              logo: "https://www.constructkvv.com/kvv-logo.png",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+250 7888 507",
                  contactType: "customer service",
                  areaServed: "RW",
                  availableLanguage: ["en", "fr", "rw"],
                },
              ],
              sameAs: [
                "https://www.facebook.com/kvvltd",
                "https://www.linkedin.com/company/kvvltd",
                "https://www.instagram.com/kvvltd/",
              ],
            }),
          }}
        />
      </Head>
      <Banner />
      <ProjectShowcase />

      {/* hire a professional section */}
      <section className="w-full bg-white py-12">
        <div className="max-w-5xl mx-auto text-center px-4">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8">
            <span className="italic">Hire Pros</span> for Your Renovation
          </h2>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center bg-white rounded-full shadow-md max-w-3xl mx-auto relative">
            {" "}
            {/* removed overflow-hidden */}
            {/* Service Input with Dropdown */}
            <div className="flex items-center w-full md:w-1/2 border-b md:border-b-0 md:border-r px-4 py-3 relative">
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="What service do you need?"
                className="w-full border-0 focus:ring-0 text-gray-700 placeholder-gray-400 rounded-full px-4 py-2"
                value={serviceInput}
                onChange={(e) => {
                  setServiceInput(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                autoComplete="off"
              />
              {showDropdown && serviceInput && filteredServices.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 top-full mt-2 w-full bg-amber-50 border border-amber-400 ring-2 ring-amber-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                >
                  {filteredServices.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:bg-amber-100 cursor-pointer text-left"
                      onMouseDown={() => {
                        setServiceInput(option);
                        setShowDropdown(false);
                        inputRef.current?.blur();
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* District Input with Dropdown */}
            <div className="flex items-center w-full md:w-1/4 border-b md:border-b-0 md:border-r px-4 py-3 relative">
              <MdLocationPin className="w-5 h-5 text-gray-400 mr-2" />
              <input
                ref={districtInputRef}
                type="text"
                placeholder="District"
                className="w-full border-0 focus:ring-0 text-gray-700 placeholder-gray-400 rounded-full px-4 py-2"
                value={districtInput}
                onChange={(e) => {
                  setDistrictInput(e.target.value);
                  setShowDistrictDropdown(true);
                }}
                onFocus={() => setShowDistrictDropdown(true)}
                autoComplete="off"
              />
              {showDistrictDropdown &&
                districtInput &&
                filteredDistricts.length > 0 && (
                  <div
                    ref={districtDropdownRef}
                    className="absolute left-0 top-full mt-2 w-full bg-amber-50 border border-amber-400 ring-2 ring-amber-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                  >
                    {filteredDistricts.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-amber-100 cursor-pointer text-left"
                        onMouseDown={() => {
                          setDistrictInput(option);
                          setShowDistrictDropdown(false);
                          districtInputRef.current?.blur();
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
            </div>
            {/* Button */}
            <button
              className="w-full md:w-auto px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-900 transition mx-1 my-2 flex items-center justify-center"
              onClick={() => router.push("/proMatch")}
            >
              <span className="inline-block align-middle">
                Match With a Pro
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Visualize Dream Home Section */}
      <section className="w-full bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-900">
            {t(dashboardFakes.VisualizeSection.title)}
          </h2>
          <Link href="/visualize">
            <button className="mt-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all flex items-center gap-2">
              {t(dashboardFakes.VisualizeSection.button)}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </Link>
        </div>
      </section>
      <ServicesShowCaseSection />
      {/* Recommendations Section */}
      <RecommendedProductsSection />
      <Products />
    </>
  );
}
