'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GenericButton } from "@/components/ui/generic-button";
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Service } from '@/types/service';
import { useServices } from '@/app/hooks/useService';
import { useShop } from '@/app/hooks/useShop';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import ProductImageUpload from '../products/create/ProductImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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
  Wrench,
  Home
} from "lucide-react";
import { zodResolver } from '@hookform/resolvers/zod';
import { createServiceSchema } from '@/utils/middlewares/Validation';
import { ServiceCategorySelect } from '../products/create/CategorySelect';
import { categoryService } from "@/app/services/categoryServices";
import { serviceService } from '@/app/services/serviceServices';
import { toast } from 'sonner';

type CreateServiceFormInput = {
  title: string;
  category: string;
  description: string;
  availability: string;
  features: { value: string }[];
  specifications: { value: string }[];
  providerName: string;
  providerAvatarFile: File | null;
  providerRating?: string;
  providerReviews?: string;
  providerVerified?: boolean;
  providerYearsExperience: string;
  basePrice: string;
  unit: string;
  estimatedTotal: string;
  city: string;
  serviceRadius: string;
  warrantyDuration: string;
  warrantyCoverage: { value: string }[];
  gallery: File[];
};

const defaultGallery = [
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
];


const Page = () => {
  const { createService, isLoading: isCreating } = useServices();
  const { myShop, isMyShopLoading } = useShop();

  const form = useForm<CreateServiceFormInput>({
    defaultValues: {
      title: '',
      category: '',
      description: '',
      availability: '',
      features: [{ value: '' }],
      specifications: [{ value: '' }],
      providerName: '',
      providerAvatarFile: null,
      providerRating: '',
      providerReviews: '',
      providerVerified: false,
      providerYearsExperience: '',
      basePrice: '',
      unit: '',
      estimatedTotal: '',
      city: '',
      serviceRadius: '',
      warrantyDuration: '',
      warrantyCoverage: [{ value: '' }],
      gallery: [],
    },
  });

  // Field arrays for features, specifications, gallery
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: 'features',
  });
  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });
  // Add field array for warrantyCoverage
  const { fields: coverageFields, append: appendCoverage, remove: removeCoverage } = useFieldArray({
    control: form.control,
    name: 'warrantyCoverage',
  });

  // Gallery image preview logic
  const galleryFiles = (form.watch('gallery') as File[]);
  const galleryImages = galleryFiles.map((file, idx) => ({
    url: URL.createObjectURL(file),
    alt: `Gallery image ${idx + 1}`,
    isDefault: idx === 0,
  }));

  const handleAddGalleryImages = (files: FileList) => {
    const currentImages = form.watch('gallery') as File[];
    if (currentImages.length >= 3) {
      alert('You can only upload up to 3 images.');
      return;
    }
    const filesToAdd = Array.from(files).slice(0, 3 - currentImages.length);
    form.setValue('gallery', [...currentImages, ...filesToAdd]);
  };
  const handleRemoveGalleryImage = (idx: number) => {
    const currentImages = form.watch('gallery') as File[];
    form.setValue('gallery', currentImages.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: CreateServiceFormInput) => {
    try {
      if (!myShop?.id) {
        toast.error("You must have a shop to create a service.");
        return;
      }
      if (!data.availability) {
        toast.error('Availability is required.');
        return;
      }
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : undefined;
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('availability', data.availability);
      // Features as array (multiple fields)
      const featuresArr = data.features.map(f => f.value).filter(Boolean);
      if (featuresArr.length === 0) {
        toast.error('At least one feature is required.');
        return;
      }
      featuresArr.forEach(feature => formData.append('features', feature));
      // Specifications as object
      const specsObj: Record<string, string> = {};
      data.specifications.forEach((spec) => {
        const [key, value] = spec.value.split(':').map(s => s.trim());
        if (key && value) specsObj[key] = value;
      });
      if (Object.keys(specsObj).length === 0) {
        toast.error('At least one valid specification (key: value) is required.');
        return;
      }
      formData.append('specifications', JSON.stringify(specsObj));
      // Provider object (without avatar)
      formData.append('provider', JSON.stringify({
        name: data.providerName,
        yearsExperience: Number(data.providerYearsExperience)
      }));
      // Pricing object
      formData.append('pricing', JSON.stringify({
        basePrice: Number(data.basePrice),
        unit: data.unit,
        estimatedTotal: data.estimatedTotal
      }));
      // Location object
      formData.append('location', JSON.stringify({
        city: data.city,
        serviceRadius: data.serviceRadius
      }));
      // Warranty object
      formData.append('warranty', JSON.stringify({
        duration: data.warrantyDuration,
        coverage: data.warrantyCoverage.map(c => c.value).filter(Boolean)
      }));
      // Gallery images
      if (!data.gallery || data.gallery.length === 0) {
        toast.error('At least one image is required.');
        return;
      }
      data.gallery.forEach((file) => {
        formData.append('gallery', file);
      });
      // Provider avatar image
      if (data.providerAvatarFile) {
        formData.append('avatar', data.providerAvatarFile);
      }
      formData.append('shopId', myShop.id);
      // Log all FormData entries
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }
      await serviceService.createService(myShop.id, formData, authToken!);
      toast.success('Service created successfully!');
      form.reset();
    } catch (error: any) {
      let message = 'Failed to create service. Please try again.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      toast.error(message);
    }
  };

  const watchAllFields = form.watch();
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategoryName() {
      if (!watchAllFields.category) {
        setCategoryName("");
        return;
      }
      try {
        const cat = await categoryService.getCategoryById(watchAllFields.category);
        setCategoryName(cat.name);
      } catch {
        setCategoryName("Unknown");
      }
    }
    fetchCategoryName();
  }, [watchAllFields.category]);

  useEffect(() => {
    async function fetchCategories() {
      setLoadingCategories(true);
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (myShop?.name && !form.getValues('providerName')) {
      form.setValue('providerName', myShop.name);
    }
  }, [myShop, form]);

  if (isMyShopLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg">Loading your shop...</p>
      </div>
    );
  }

  if (!myShop) {
    return (
      <div className="p-8">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Shop Required!</AlertTitle>
          <AlertDescription>
            You need to create a shop before you can add a service.
            <Link href="/dashboard/profile" className="font-bold text-amber-600 hover:underline ml-1">
              Go to your profile to create one.
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 p-8 w-full">
      {/* Form Section */}
      <div className="flex-1 max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create a New Service</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Premium Laminate Flooring Installation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full border rounded px-3 py-2">
                      <option value="">Select a category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Robin's Construction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="providerAvatarFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Avatar (Image Upload)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="providerYearsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Years Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12" type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 8.50" type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., per sq ft" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Total</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Kigali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Radius</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 25 miles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warrantyDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lifetime Residential" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Warranty Coverage dynamic list */}
            <div>
              <FormLabel>Warranty Coverage</FormLabel>
              {coverageFields.map((item, idx) => (
                <div key={item.id} className="flex gap-2 mb-2">
                  <FormControl>
                    <Input
                      {...form.register(`warrantyCoverage.${idx}.value` as const)}
                      placeholder="e.g., Full coverage guarantee"
                    />
                  </FormControl>
                  <GenericButton type="button" variant="outline" onClick={() => removeCoverage(idx)} disabled={coverageFields.length === 1}>Remove</GenericButton>
                </div>
              ))}
              <GenericButton type="button" variant="secondary" onClick={() => appendCoverage({ value: '' })}>Add Coverage</GenericButton>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the service..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Features dynamic list */}
            <div>
              <FormLabel>Features</FormLabel>
              {featureFields.map((item, idx) => (
                <div key={item.id} className="flex gap-2 mb-2">
                  <FormControl>
                    <Input
                      {...form.register(`features.${idx}.value` as const)}
                      placeholder="e.g., Waterproof & Scratch Resistant"
                    />
                  </FormControl>
                  <GenericButton type="button" variant="outline" onClick={() => removeFeature(idx)} disabled={featureFields.length === 1}>Remove</GenericButton>
                </div>
              ))}
              <GenericButton type="button" variant="secondary" onClick={() => appendFeature({ value: '' })}>Add Feature</GenericButton>
            </div>
            {/* Specifications dynamic list */}
            <div>
              <FormLabel>Specifications</FormLabel>
              {specFields.map((item, idx) => (
                <div key={item.id} className="flex gap-2 mb-2">
                  <FormControl>
                    <Input
                      {...form.register(`specifications.${idx}.value` as const)}
                      placeholder="e.g., 47.8 in"
                    />
                  </FormControl>
                  <GenericButton type="button" variant="outline" onClick={() => removeSpec(idx)} disabled={specFields.length === 1}>Remove</GenericButton>
                </div>
              ))}
              <GenericButton type="button" variant="secondary" onClick={() => appendSpec({ value: '' })}>Add Specification</GenericButton>
            </div>
            {/* Gallery image upload */}
            <ProductImageUpload
              images={galleryImages}
              onAddImages={handleAddGalleryImages}
              onRemoveImage={handleRemoveGalleryImage}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Available this week" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4 border-t">
              <GenericButton
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isCreating}
              >
                Cancel
              </GenericButton>
              {/* Use a native button for submit */}
              <button
                type="submit"
                disabled={isCreating}
                className="ml-2 px-4 py-2 rounded bg-amber-400 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" /> Creating...
                  </span>
                ) : (
                  "Create Service (New)"
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>
      <Separator orientation="vertical" className="hidden md:block h-auto" />
      {/* Service-style Preview Section */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Live Preview</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Gallery */}
            <Card>
              <CardContent>
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={galleryImages[selectedImage]?.url || defaultGallery[0]}
                    width={800}
                    height={450}
                    alt="Service gallery"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    {watchAllFields.availability || 'Availability'}
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {galleryImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image src={img.url} width={80} height={64} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
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
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                Save
              </GenericButton>
              <GenericButton variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </GenericButton>
            </div>
            {/* Service Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">{categoryName || 'Category'}</Badge>
                    <h1 className="text-3xl font-bold text-gray-900">{watchAllFields.title || 'Service Title'}</h1>
                    <p className="text-gray-600 mt-2">{watchAllFields.description || 'Service description goes here...'}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {watchAllFields.city || 'Location'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      {watchAllFields.serviceRadius || 'Radius'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {watchAllFields.availability || 'Availability'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {watchAllFields.warrantyDuration || 'Warranty'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tabs Section */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="flex justify-between w-full">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="mt-6">
                    <div className="w-full border">
                      {watchAllFields.features?.filter(f => f.value).map((feature, index) => (
                        <div key={index} className="flex items-center py-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm break-words">{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="specifications" className="mt-6">
                    <div className="w-full border">
                      {watchAllFields.specifications?.filter(spec => typeof spec?.value === 'string' && spec.value.trim()).map((spec, idx) => (
                        <div key={idx} className="py-2 border-b border-gray-100 w-full">
                          <span className="text-sm text-gray-900 break-words">{spec.value}</span>
                        </div>
                      ))}
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
                      <span className="text-3xl font-bold">{watchAllFields.basePrice || '$0.00'}</span>
                      <span className="text-gray-600">per service</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated total: {watchAllFields.estimatedTotal || '$0.00'}
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
                      src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                      width={48}
                      height={48}
                      alt={watchAllFields.providerName || 'Provider'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{watchAllFields.providerName || 'Provider Name'}</h3>
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">4.9</span>
                        </div>
                        <span>(247 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>12 years exp.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>247 clients</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <GenericButton variant="outline" className="w-full justify-start" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Provider
                    </GenericButton>
                    <GenericButton variant="outline" className="w-full justify-start" size="sm">
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
                <h3 className="font-semibold mb-4">Service Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Free Consultation</p>
                      <p className="text-xs text-gray-600">On-site assessment included</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Lifetime Warranty</p>
                      <p className="text-xs text-gray-600">Full coverage guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Professional Tools</p>
                      <p className="text-xs text-gray-600">Commercial grade equipment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page; 