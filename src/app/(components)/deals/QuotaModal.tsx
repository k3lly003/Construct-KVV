"use client";

import React from 'react';
import { Calculator, Send } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { GenericButton } from "@/components/ui/generic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShadQuotaPropsDto } from '@/app/utils/dtos/deals.dtos';


const ShadQuota: React.FC<ShadQuotaPropsDto> = ({
    isOpen,
    onClose,
    product,
    initialQuantity,
    formData,
    onFormDataChange,
    onSubmitQuote,
    onQuantityChange,
    calculateTotal,
}) => {
    if (!product) {
        return null; // Or some other fallback UI
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Request Quote</DialogTitle>
                    <DialogDescription>{product.name}</DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmitQuote} className="space-y-6">
                    {/* Quantity and Price Calculator */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Calculator className="h-5 w-5 text-amber-500 mr-2" />
                                <span className="font-medium">Price Calculator</span>
                            </div>
                            <div className="text-small text-gray-500">
                                Min. Order: {product.minOrder} {product.unit}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1">
                                <Label htmlFor="quantity">
                                    Quantity ({product.unit})
                                </Label>
                                <Input
                                    type="number"
                                    id="quantity"
                                    value={initialQuantity}
                                    onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                                    min={product.minOrder}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="block text-small font-medium text-gray-700 mb-1">
                                    Total Estimate
                                </div>
                                <div className="text-mid font-bold text-amber-500">
                                    {calculateTotal().toLocaleString()} Rfw
                                </div>
                            </div>
                        </div>
                        {initialQuantity > 0 && initialQuantity < product.minOrder && (
                            <p className="text-red-600 text-small">
                                Quantity must be at least {product.minOrder} {product.unit}
                            </p>
                        )}
                    </div>

                    {/* Company Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="company">Company Name</Label>
                            <Input
                                type="text"
                                id="company"
                                value={formData.company}
                                onChange={(e) => onFormDataChange({ ...formData, company: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="contact">Contact Person</Label>
                            <Input
                                type="text"
                                id="contact"
                                value={formData.contact}
                                onChange={(e) => onFormDataChange({ ...formData, contact: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div>
                        <Label htmlFor="deliveryLocation">Delivery Location</Label>
                        <Input
                            type="text"
                            id="deliveryLocation"
                            value={formData.deliveryLocation}
                            onChange={(e) => onFormDataChange({ ...formData, deliveryLocation: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="preferredDeliveryDate">Preferred Delivery Date</Label>
                        <Input
                            type="date"
                            id="preferredDeliveryDate"
                            value={formData.preferredDeliveryDate}
                            onChange={(e) => onFormDataChange({ ...formData, preferredDeliveryDate: e.target.value })}
                            className="w-full"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="requirements">Additional Requirements</Label>
                        <Textarea
                            id="requirements"
                            rows={4}
                            value={formData.requirements}
                            onChange={(e) => onFormDataChange({ ...formData, requirements: e.target.value })}
                            placeholder="Specify any special requirements, customizations, or questions..."
                        />
                    </div>

                    <DialogFooter className="sm:justify-end">
                        <GenericButton type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </GenericButton>
                        <GenericButton type="submit" disabled={initialQuantity < product.minOrder} className='border-1 border-amber-500 hover:bg-amber-500 hover:text-white text-amber-500 bg-white'>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Quote Request
                        </GenericButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ShadQuota;
