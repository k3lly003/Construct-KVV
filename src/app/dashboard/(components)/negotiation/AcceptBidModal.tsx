"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const acceptBidSchema = z.object({
  finalAmount: z.coerce
    .number()
    .positive("Final amount must be a positive number"),
});

type AcceptBidFormValues = z.infer<typeof acceptBidSchema>;

interface AcceptBidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcceptBidModal = ({ isOpen, onClose }: AcceptBidModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptBidFormValues>({
    resolver: zodResolver(acceptBidSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<AcceptBidFormValues> = async () => {
    setIsLoading(true);
    // Placeholder for acceptBid
    // Replace with actual implementation
    await Promise.resolve();
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalize and Accept Bid</DialogTitle>
          <DialogDescription>
            Please enter the final agreed-upon amount. This will accept the bid,
            close the project, and reject all other bids. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="finalAmount">Final Amount ($)</Label>
            <Input
              id="finalAmount"
              type="number"
              {...register("finalAmount")}
            />
            {errors.finalAmount && (
              <p className="text-sm text-red-500">
                {errors.finalAmount.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border"
              disabled={false}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Accepting..." : "Accept & Finalize"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
