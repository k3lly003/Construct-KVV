'use client';

import React from 'react';
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
import ServicePreview from './ServicePreview';
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

type CreateServiceFormInput = {
  title: string;
  category: string;
  description: string;
  availability: string;
  features: { value: string }[];
  specifications: { key: string; value: string }[];
  provider: string;
  pricing: string;
  location: string;
  warranty: string;
  gallery: { url: string }[];
};

const defaultGallery = [
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
];

const Page = () => {
  const { createService, isLoading: isCreating } = useServices();
  const { myShop, isMyShopLoading } = useShop();

  const form = useForm<CreateServiceFormInput>({
    resolver: zodResolver(createServiceSchema) as any,
    defaultValues: {
      title: '',
      category: '',
      description: '',
      availability: '',
      features: [{ value: '' }],
      specifications: [{ key: '', value: '' }],
      provider: '',
      pricing: '',
      location: '',
      warranty: '',
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

  const galleryImages = (form.watch('gallery') as { url: string }[]).map((img, idx) => ({
    url: img.url,
    alt: `Gallery image ${idx + 1}`,
    isDefault: idx === 0, // first image as default, others false
  }));
  const handleAddGalleryImages = (files: FileList) => {
    const newImages = Array.from(files).map((file, idx) => ({
      url: URL.createObjectURL(file),
      alt: `Gallery image ${galleryImages.length + idx + 1}`,
      isDefault: false,
    }));
    form.setValue('gallery', [...form.watch('gallery'), ...newImages]);
  };
  const handleRemoveGalleryImage = (idx: number) => {
    form.setValue('gallery', galleryImages.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: CreateServiceFormInput) => {
    if (!myShop?.id) {
      alert("You must have a shop to create a service.");
      return;
    }
    // Build FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('availability', data.availability);
    // features: array of strings
    formData.append('features', JSON.stringify(data.features.map(f => f.value)));
    // specifications: object { key: value, ... }
    const specsObj: Record<string, string> = {};
    data.specifications.forEach((spec) => {
      if (spec.key && spec.value) specsObj[spec.key] = spec.value;
    });
    formData.append('specifications', JSON.stringify(specsObj));
    // provider, pricing, location, warranty: objects
    formData.append('provider', JSON.stringify({ name: data.provider }));
    formData.append('pricing', JSON.stringify({ price: data.pricing }));
    formData.append('location', JSON.stringify({ address: data.location }));
    formData.append('warranty', JSON.stringify({ details: data.warranty }));
    // gallery: array of strings
    formData.append('gallery', JSON.stringify(data.gallery.map(g => g.url)));
    formData.append('shopId', myShop.id);
    await createService(myShop.id, formData);
    form.reset();
  };

  const watchAllFields = form.watch();

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isFavorited, setIsFavorited] = React.useState(false);

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
                    <Input placeholder="e.g., Flooring Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ProFloor Masters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing (e.g., 8.50 per sq ft)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 8.50 per sq ft" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lifetime Residential" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      {...form.register(`specifications.${idx}.key` as const)}
                      placeholder="Key (e.g., Product Length)"
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      {...form.register(`specifications.${idx}.value` as const)}
                      placeholder="Value (e.g., 47.8 in)"
                    />
                  </FormControl>
                  <GenericButton type="button" variant="outline" onClick={() => removeSpec(idx)} disabled={specFields.length === 1}>Remove</GenericButton>
                </div>
              ))}
              <GenericButton type="button" variant="secondary" onClick={() => appendSpec({ key: '', value: '' })}>Add Specification</GenericButton>
            </div>
            {/* Gallery image upload */}
            <ProductImageUpload
              images={galleryImages}
              onAddImages={handleAddGalleryImages}
              onRemoveImage={handleRemoveGalleryImage}
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
              <GenericButton type="submit" disabled={isCreating}>
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" /> Creating...
                  </span>
                ) : (
                  "Create Service"
                )}
              </GenericButton>
            </div>
          </form>
        </Form>
      </div>
      <Separator orientation="vertical" className="hidden md:block h-auto" />
      {/* Soso-style Preview Section */}
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
                    <Badge variant="secondary" className="mb-2">{watchAllFields.category || 'Category'}</Badge>
                    <h1 className="text-3xl font-bold text-gray-900">{watchAllFields.title || 'Service Title'}</h1>
                    <p className="text-gray-600 mt-2">{watchAllFields.description || 'Service description goes here...'}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {watchAllFields.location || 'Location'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      25 miles radius
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {watchAllFields.availability || 'Availability'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tabs Section */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="warranty">Warranty</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {watchAllFields.features?.filter(f => f.value).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="specifications" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {watchAllFields.specifications?.filter(s => s.key && s.value).map((spec, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">{spec.key}</span>
                          <span className="text-sm text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="warranty" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">{watchAllFields.warranty || 'Warranty'}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Coverage includes:</h4>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Manufacturing defects</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Wear and tear protection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Water damage coverage</span>
                        </div>
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
                      <span className="text-3xl font-bold">{watchAllFields.pricing || '$0.00'}</span>
                      <span className="text-gray-600">per service</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated total: $0.00
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
                      alt={watchAllFields.provider || 'Provider'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{watchAllFields.provider || 'Provider Name'}</h3>
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