'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
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

type CreateServiceFormInput = Omit<Service, 'id' | 'createdAt'>;

const Page = () => {
  const { createService, isLoading: isCreating } = useServices();
  const { myShop, isMyShopLoading } = useShop();

  const form = useForm<CreateServiceFormInput>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discountedPrice: 0,
      isActive: true,
    },
  });
  
  const onSubmit = async (data: CreateServiceFormInput) => {
    if (!myShop?.id) {
      alert("You must have a shop to create a service.");
      return;
    }
    await createService(myShop.id, data);
    form.reset();
  };

  const watchAllFields = form.watch();

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
      <div className="flex-1 max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Create a New Service</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Waterproof Laminate Flooring" {...field} />
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
                    <Textarea
                      placeholder="Describe the service..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Rwf)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                    <FormLabel>Discounted Price (Rwf)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Enter discounted price"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Activate Service
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Make this service available in your shop immediately.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
              <GenericButton type="submit" disabled={isCreating} className="gap-2">
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Service
              </GenericButton>
            </div>
          </form>
        </Form>
      </div>

      <Separator orientation="vertical" className="hidden md:block h-auto" />
      
      {/* Preview Section */}
      <div className="flex-1 max-w-md">
        <h3 className="text-lg font-semibold text-center mb-4">Live Preview</h3>
        <div className="flex justify-center">
            <ServicePreview
              name={watchAllFields.name}
              description={watchAllFields.description}
              price={watchAllFields.price}
            />
        </div>
      </div>
    </div>
  );
}
export default Page; 