'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
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
import { Separator } from '@/components/ui/separator';
import {type CreateProductInput } from '../../../utils/middlewares/Validation';
import { useProducts } from '@/app/hooks/useProduct';
import ProductPreview from "../../(components)/products/ProductPreview";
import CategorySelect from "./CategorySelect";
import ProductImageUpload from "./ProductImageUpload";
// Removed useShop import - sellers no longer need shops
import { useCustomerProfile } from '@/app/hooks/useCustomerProfile';
// Removed unused imports: Alert, Terminal, Link (no longer needed)


const Page = () => {
  const { createProduct, isLoading } = useProducts();
  const { profile, isLoading: isProfileLoading } = useCustomerProfile();

  // Console logs to verify fetched data
  // console.log("Fetched Shop Data:", myShop);

  const form = useForm<CreateProductInput & { images: { url: string; alt: string; isDefault: boolean; file?: File }[]; shopId?: string | null }>({
    // resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: 0,
      inventory: 0,
      sku: '',
      slug: '',
      isActive: true,
      sellerId: '',
      categoryId: "",
      shopId: '', // Optional - no shop required
      discountedPrice: '',
      attributes: {},
      images: [],
    },
  });
  useEffect(() => {
    if (profile?.id) {
      form.setValue('sellerId', profile.id);
      console.log("Setting sellerId in form:", profile.id);
    }
    // Sellers no longer need shops - always set shopId to empty
    form.setValue('shopId', '');
    console.log("Sellers no longer need shops - product will be created without shop association");
  }, [profile, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });

  // Auto-generate slug and sku from name
  const watchName = form.watch('name');
  useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      form.setValue('slug', slug);
      
      // Auto-generate SKU from name
      const sku = watchName.toUpperCase().replace(/\s/g, '').slice(0, 12);
      form.setValue('sku', sku);
    }
  }, [watchName, form]);

  // Sync inventory with stock
  const watchStock = form.watch('stock');
  useEffect(() => {
    form.setValue('inventory', watchStock || 0);
  }, [watchStock, form]);

  const onSubmit = async (data: CreateProductInput & { images: { url: string; alt: string; isDefault: boolean; file?: File }[] }) => {
    try {
      // Basic validation
      if (!data.name?.trim()) {
        throw new Error('Product name is required');
      }
      if (!data.price?.trim()) {
        throw new Error('Price is required');
      }
      if (!data.sku?.trim()) {
        throw new Error('SKU is required');
      }

      const formData = new FormData();

      // Get the current images from form state (which includes the file property)
      const currentImages = form.getValues("images") as { url: string; alt: string; isDefault: boolean; file?: File }[] || [];
      
      // Append basic product data directly to FormData (matching backend expectations)
      formData.append('name', data.name.trim());
      if (data.description?.trim()) formData.append('description', data.description.trim());
      formData.append('price', data.price.trim());
      formData.append('stock', data.stock.toString());
      formData.append('inventory', data.inventory.toString());
      formData.append('sku', data.sku.trim());
      if (data.slug?.trim()) formData.append('slug', data.slug.trim());
      formData.append('isActive', data.isActive.toString());
      formData.append('sellerId', data.sellerId);
      if (data.categoryId?.trim()) formData.append('categoryId', data.categoryId);
      if (data.shopId?.trim()) formData.append('shopId', data.shopId);
      if (data.discountedPrice?.trim()) formData.append('discountedPrice', data.discountedPrice.trim());
      if (data.attributes && Object.keys(data.attributes).length > 0) {
        formData.append('attributes', JSON.stringify(data.attributes));
      }

      // Append images as files (backend expects 'images' field with multiple files)
      currentImages.forEach((img) => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });

      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Form data being sent:', {
        name: data.name,
        price: data.price,
        sku: data.sku,
        sellerId: data.sellerId,
        shopId: data.shopId,
        categoryId: data.categoryId,
        imageCount: currentImages.filter(img => img.file).length
      });

      await createProduct(formData);
      form.reset();
    } catch (error) {
      console.error('Product creation error:', error);
      // Error handled by mutation
    }
  };

  const watchAllFields = form.watch();

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg">Loading your profile...</p>
      </div>
    );
  }

  // Shop requirement removed - sellers can now add products directly

  return (
    <div className="flex flex-col lg:flex-row gap-0 w-full min-h-screen max-w-none -mx-9 -my-7 bg-white dark:bg-gray-800 ml-2 p-10">
      {/* Form Section */}
      <div className="flex-1 lg:flex-[2] p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Basic Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Product Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter product name" 
                          {...field} 
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Pricing & Inventory */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Pricings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          value={form.watch('price')}
                          onChange={e => form.setValue('price', e.target.value)}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Discounted Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          value={form.watch('discountedPrice')}
                          onChange={e => form.setValue('discountedPrice', e.target.value)}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Product Media */}
            <ProductImageUpload
              images={form.watch("images") as { url: string; alt: string; isDefault: boolean; file?: File }[]}
              onAddImages={files => {
                const newImages = Array.from(files).map(file => ({
                  url: URL.createObjectURL(file),
                  file, // store the actual file
                                    alt: file.name,
                  isDefault: false,
                }));
                form.setValue("images", [...form.getValues("images"), ...newImages]);
              }}
              onRemoveImage={idx => {
                const imgs = [...form.getValues("images")];
                imgs.splice(idx, 1);
                form.setValue("images", imgs);
              }}
            />

            <Separator />

            {/* Category */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Category</h3>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Product Category</FormLabel>
                    <FormControl>
                      <CategorySelect
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <GenericButton
                type="button"
                variant="outline"
                onClick={() => {}}
                disabled={isLoading}
                className="h-10 px-6"
              >
                Cancel
              </GenericButton>
              <GenericButton 
                type="submit" 
                disabled={isLoading} 
                className="gap-2 h-10 px-6"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Product
              </GenericButton>
            </div>
          </form>
        </Form>
      </div>
      <div className="hidden lg:block w-px bg-gray-200 dark:bg-gray-600"></div>
      {/* Preview Section */}
      <div className="flex-1 lg:flex-[1] p-2">
        <h3 className="text-base font-semibold">Live Preview</h3>
        <ProductPreview
          name={watchAllFields.name}
          description={watchAllFields.description}
          price={watchAllFields.price}
          images={watchAllFields.images}
        />
      </div>
    </div>
  );
}
export default Page;
