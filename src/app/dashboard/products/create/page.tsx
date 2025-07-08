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
import { useShop } from '@/app/hooks/useShop';
import { useCustomerProfile } from '@/app/hooks/useCustomerProfile';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from 'next/link';


const Page = () => {
  const { createProduct, isLoading } = useProducts();
  const { myShop, isMyShopLoading } = useShop();
  const { profile, isLoading: isProfileLoading } = useCustomerProfile();

  // Console logs to verify fetched data
  // console.log("Fetched Shop Data:", myShop);

  const form = useForm<CreateProductInput & { images: { url: string; alt: string; isDefault: boolean; file?: File }[] }>({
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
      shopId: '',
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
    if (myShop?.id) {
      form.setValue('shopId', myShop.id);
      console.log("Setting shopId in form:", myShop.id);
    }
  }, [profile, myShop, form]);

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
      const formData = new FormData();

      // Get the current images from form state (which includes the file property)
      const currentImages = form.getValues("images") as { url: string; alt: string; isDefault: boolean; file?: File }[];
      
      // Separate images and the rest of the product data
      const { images, ...productData } = data;

      // Append product data as JSON string
      formData.append('data', JSON.stringify(productData));

      // Build and append image metadata as JSON string
      const imageData = currentImages.map((img, index) => ({
        fileKey: img.file ? img.file.name : `image_${index}`,
        alt: img.alt,
        isDefault: img.isDefault,
      }));
      formData.append('imageData', JSON.stringify(imageData));

      // Append each file as 'images'
      currentImages.forEach(img => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });

      await createProduct(formData);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const watchAllFields = form.watch();

  if (isMyShopLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg">Loading your data...</p>
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
             You need to create a shop before you can add products. 
             <Link href="/dashboard/profile" className="font-bold text-amber-600 hover:underline ml-1">
                Go to your profile to create one.
             </Link>
           </AlertDescription>
         </Alert>
       </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 p-8 w-[100%]">
      {/* Form Section */}
      <div className="flex-1 max-w-xl w-[55%]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={form.watch('price')}
                          onChange={e => form.setValue('price', e.target.value)}
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
                    <FormItem>
                      <FormLabel>Discounted Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={form.watch('discountedPrice')}
                          onChange={e => form.setValue('discountedPrice', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <GenericButton
                type="button"
                variant="outline"
                onClick={() => {}}
                disabled={isLoading}
              >
                Cancel
              </GenericButton>
              <GenericButton type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Product
              </GenericButton>
            </div>
          </form>
        </Form>
      </div>
      <Separator orientation="vertical" className="hidden md:block h-full" />
      {/* Preview Section */}
      <div className="flex-1 max-w-md w-[45%]">
        <h3 className="text-lg font-semibold">Live Preview</h3>
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
