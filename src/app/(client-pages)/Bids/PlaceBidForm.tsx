"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useBids } from '@/app/hooks/useBids';
import { toast } from 'sonner';

const bidSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  message: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type BidFormValues = z.infer<typeof bidSchema>;

interface PlaceBidFormProps {
  projectId: string;
}

export const PlaceBidForm = ({ projectId }: PlaceBidFormProps) => {
  const { createBid, isCreatingBid } = useBids();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      agreedToTerms: false,
    }
  });

  const onSubmit: SubmitHandler<BidFormValues> = async (data) => {
    try {
      await createBid({
        ...data,
        finalProjectId: projectId,
      });
      toast.success('Bid placed successfully!');
    } catch (error) {
      toast.error('Failed to place bid. Please try again.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-50 p-6 rounded-lg shadow-md">
       <h3 className="text-xl font-semibold">Place Your Bid</h3>
      <div className="space-y-2">
        <Label htmlFor="amount">Bid Amount ($)</Label>
        <Input id="amount" type="number" {...register('amount')} />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea id="message" {...register('message')} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="agreedToTerms" {...register('agreedToTerms')} />
        <Label htmlFor="agreedToTerms">I agree to the terms and conditions</Label>
      </div>
      {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>}
      
      {/* The custom button does not support form submission directly. 
          A simple solution is to wrap a standard button, but for now we use a workaround.
          This will be visually inconsistent.
      */}
      <button type="submit" disabled={isCreatingBid} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
        {isCreatingBid ? 'Placing Bid...' : 'Place Bid'}
      </button>
    </form>
  );
}; 