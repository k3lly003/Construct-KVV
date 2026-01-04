"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Award,
  Users,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Heart,
  Share2,
  MessageCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { useParams } from "next/navigation";
import { serviceService } from "@/app/services/serviceServices";
import { categoryService } from "@/app/services/categoryServices";
import { GenericButton } from "@/components/ui/generic-button";
import Image, { StaticImageData } from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ServiceImage {
  id: string;
  url: string | StaticImageData;
  alt: string;
  isDefault: boolean;
}

const Page = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const params = useParams();
  const id = params?.id;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = serviceData?.title || "Check out this service!";
  const shareLinks = {
    email: `mailto:?subject=${encodeURIComponent(
      shareTitle
    )}&body=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(shareTitle)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareTitle)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(
      shareUrl
    )}`,
  };

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setShareOpen(true);
    } catch {
      toast.error("Failed to copy link");
      setShareOpen(true);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    serviceService
      .getServiceById(id as string)
      .then((data) => {
        setServiceData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load service.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (serviceData && serviceData.category) {
      categoryService
        .getCategoryById(serviceData.category)
        .then((cat) => setCategoryName(cat.name))
        .catch(() => setCategoryName("Unknown"));
    }
  }, [serviceData && serviceData.category]);

  // Convert serviceData.gallery[] to ProductGallery format
  const images: ServiceImage[] =
    (serviceData?.gallery || []).map((url: string, i: number) => ({
      id: String(i + 1),
      url,
      alt: serviceData?.title
        ? `${serviceData.title} image ${i + 1}`
        : `Service gallery ${i + 1}`,
      isDefault: i === 0,
    })) || [];

  // ProductGallery logic
  const allImages = images;
  const mainImage = allImages[currentImageIndex];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToThumbnail = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading service...
      </div>
    );
  }
  if (error || !serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Service not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 my-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Gallery */}
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative bg-muted border-1 rounded-lg overflow-hidden aspect-video">
                    {/* Main image */}
                    {mainImage ? (
                      <Image
                        src={mainImage.url}
                        alt={mainImage.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 700px"
                        style={{ objectFit: "cover" }}
                        priority
                        quality={90}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-400">
                        No images available.
                      </div>
                    )}
                    {serviceData.availability && (
                      <Badge className="absolute top-4 left-4 bg-green-600">
                        {serviceData.availability}
                      </Badge>
                    )}
                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                          aria-label="Previous image"
                          type="button"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={goToNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                          aria-label="Next image"
                          type="button"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {allImages.map((img, index) => (
                        <div
                          key={img.id || index}
                          onClick={() => goToThumbnail(index)}
                          className={`relative w-16 h-16 rounded-md overflow-hidden transition-all cursor-pointer ${
                            currentImageIndex === index
                              ? "border-2 border-primary ring-2 ring-primary/20"
                              : "border border-border hover:border-muted-foreground"
                          }`}
                          aria-label={`View thumbnail ${index + 1}`}
                        >
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            sizes="64px"
                            style={{ objectFit: "cover" }}
                            quality={90}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Share & like */}
            <div className="flex items-center gap-2 ml-auto">
              <GenericButton
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className="gap-2"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                Save
              </GenericButton>
              <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogTrigger asChild>
                  <GenericButton
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={handleShareClick}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </GenericButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share this service</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-start gap-4 mt-2">
                    <span className="text-small text-gray-700">
                      Share this page on:
                    </span>
                    <div className="flex gap-4">
                      <a
                        href={shareLinks.email}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share via Email"
                      >
                        <Mail className="h-6 w-6 text-gray-700 hover:text-amber-900 transition-colors" />
                      </a>
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Facebook"
                      >
                        <Facebook className="h-6 w-6 text-amber-600 hover:text-amber-800 transition-colors" />
                      </a>
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on LinkedIn"
                      >
                        <Linkedin className="h-6 w-6 text-amber-700 hover:text-amber-900 transition-colors" />
                      </a>
                      <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Twitter"
                      >
                        <Twitter className="h-6 w-6 text-amber-400 hover:text-amber-600 transition-colors" />
                      </a>
                      <a
                        href={shareLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Instagram"
                      >
                        <Instagram className="h-6 w-6 text-pink-500 hover:text-pink-700 transition-colors" />
                      </a>
                    </div>
                    <span className="text-small text-gray-400 mt-2">
                      Link copied! You can now paste it anywhere.
                    </span>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Service Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {categoryName || "Category"}
                    </Badge>
                    <h1 className="text-title font-bold text-gray-900">
                      {serviceData.title}
                    </h1>
                    <p className="text-gray-600 mt-2">
                      {serviceData.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-small text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {serviceData.location.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      {serviceData.location.serviceRadius} radius
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {serviceData.availability}
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {serviceData.warranty.duration}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="flex w-full rounded-lg overflow-hidden bg-gray-100">
                    <TabsTrigger
                      value="features"
                      className="flex-1 px-4 py-2 text-center font-medium transition-colors duration-200 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black rounded-none"
                    >
                      Features
                    </TabsTrigger>
                    <TabsTrigger
                      value="specifications"
                      className="flex-1 px-4 py-2 text-center font-medium transition-colors duration-200 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black rounded-none"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="warranty"
                      className="flex-1 px-4 py-2 text-center font-medium transition-colors duration-200 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black rounded-none"
                    >
                      Warranty
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(serviceData.features || []).map(
                        (feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-small">{feature}</span>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="specifications" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(serviceData.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100"
                          >
                            <span className="text-small font-medium text-gray-600">
                              {key}
                            </span>
                            <span className="text-small text-gray-900">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="warranty" className="mt-6">
                    <div className="rounded-xl bg-amber-100 p-6 shadow-sm border border-amber-100">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-7 h-7 text-amber-600" />
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-small font-semibold uppercase tracking-wide">
                          Warranty
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-title font-bold text-amber-900">
                          {serviceData.warranty.duration}
                        </span>
                        <span className="text-small text-amber-600">
                          duration
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold text-amber-800 mb-2">
                          Coverage includes:
                        </h4>
                        <div className="space-y-2">
                          {(
                            (serviceData.warranty &&
                              serviceData.warranty.coverage) ||
                            []
                          ).map((item: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 py-2 border-b last:border-b-0 border-amber-100"
                            >
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-base text-gray-900">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 text-small text-amber-500 italic">
                        * Warranty terms and conditions may apply. Please
                        contact the provider for full details.
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-title font-bold">
                        ${serviceData.pricing.basePrice}
                      </span>
                      <span className="text-gray-600">
                        {serviceData.pricing.unit}
                      </span>
                    </div>
                    <p className="text-small text-gray-600">
                      Estimated total: {serviceData.pricing.estimatedTotal}
                    </p>
                  </div>

                  <Separator />

                  <GenericButton className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Service
                  </GenericButton>

                  <GenericButton variant="outline" className="w-full" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Quote
                  </GenericButton>
                </div>
              </CardContent>
            </Card>

            {/* Provider Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={serviceData.provider.avatar}
                      width={48}
                      height={48}
                      alt={serviceData.provider.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {serviceData.provider.name}
                        </h3>
                        {serviceData.provider.verified && (
                          <Badge variant="secondary" className="text-small">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-small text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">
                            {serviceData.provider.rating}
                          </span>
                        </div>
                        <span>({serviceData.provider.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-small">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>{serviceData.provider.yearsExperience} years exp.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>{serviceData.provider.reviews} clients</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <GenericButton
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Provider
                    </GenericButton>
                    <GenericButton
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </GenericButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Highlights */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Service Reviews</h3>
                <div className="space-y-3">
                  {serviceData.reviews && serviceData.reviews.length > 0 ? (
                    serviceData.reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-4 last:border-b-0"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-small">
                              Verified
                            </Badge>
                          )}
                          <span className="text-small text-gray-500 ml-auto">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-small text-gray-600">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-small">No reviews yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
