"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  PackageCheck,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { initiateSplitPayment } from "@/app/services/paymentService";
import { toast } from "sonner";
import { useCartStore, useCartHydration } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getFallbackImage } from "@/app/utils/imageUtils";

export const CartPage: React.FC = () => {
  const {
    cartItems,
    cart,
    isLoading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  } = useCartStore();

  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "mobilemoney" | "card" | "bank"
  >("mobilemoney");
  const router = useRouter();

  // Hydrate cart from API
  useCartHydration();

  // Card/Bank input states
  const [cardDetails, setCardDetails] = useState({
    card_number: "",
    cvv: "",
    expiry_month: "",
    expiry_year: "",
    fullname: "",
    email: "",
    phone_number: "",
  });
  const [bankDetails, setBankDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    custom_title: "",
    custom_description: "",
    custom_logo: "",
  });

  // Flutterwave Rwanda Payment Section
  const [ngnAmount] = useState(10000); // Example: ₦10,000
  const [rwfRate, setRwfRate] = useState<number | null>(null);
  const [rwfAmount, setRwfAmount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch live exchange rate NGN to RWF
    async function fetchRate() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/NGN");
        const data = await res.json();
        if (data && data.rates && data.rates.RWF) {
          setRwfRate(data.rates.RWF);
          setRwfAmount(Math.round(ngnAmount * data.rates.RWF));
        }
      } catch (err) {
        setRwfRate(null);
        setRwfAmount(null);
      }
    }
    fetchRate();
  }, [ngnAmount]);

  // Calculate totals from API cart data
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;
  const totalItems = cart?.totalItems || 0;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      toast.error("You must be logged in to pay.");
      setLoading(false);
      setTimeout(() => {
        router.push("/signin");
      }, 1200);
      return;
    }
    // Hardcoded sellerId for now
    const sellerId = "035c3acb-3c60-4b75-a45e-a194f918aa57";
    // Generate tx_ref
    const tx_ref = `tx_${Date.now()}`;
    // Use RWF for all except bank (which must use NGN)
    const amount = Math.round(total);
    let payload: any = {};
    if (paymentMethod === "bank") {
      // Updated exchange rate: 1 NGN = 0.94 RWF
      const exchangeRate = 0.94; // 1 NGN = 0.94 RWF
      const amountNGN = Math.ceil(amount / exchangeRate);
      payload = {
        tx_ref,
        amount: amountNGN,
        currency: "NGN",
        redirect_url: "https://yourdomain.com/payment-complete",
        payment_options: "banktransfer",
        customer: {
          email: bankDetails.customer_email,
          phonenumber: bankDetails.customer_phone,
          name: bankDetails.customer_name,
        },
        customizations: {
          title: bankDetails.custom_title,
          description: bankDetails.custom_description,
          logo: bankDetails.custom_logo,
        },
      };
    } else if (paymentMethod === "mobilemoney") {
      payload = {
        tx_ref,
        amount,
        currency: "RWF",
        redirect_url: "https://yourapp.com/payment-complete",
        order_id: `order-${tx_ref}`,
        email: "mugishaelvis456@email.com",
        phone_number: "0791322102",
        narration: `Payment for order ${tx_ref}`,
      };
    } else if (paymentMethod === "card") {
      payload = {
        tx_ref,
        amount,
        currency: "RWF",
        redirect_url: "https://yourapp.com/payment-complete",
        email: cardDetails.email,
        phone_number: cardDetails.phone_number,
        card_number: cardDetails.card_number,
        cvv: cardDetails.cvv,
        expiry_month: cardDetails.expiry_month,
        expiry_year: cardDetails.expiry_year,
        fullname: cardDetails.fullname,
      };
    }
    try {
      const res: any = await initiateSplitPayment(
        {
          paymentType: paymentMethod,
          sellerId,
          payload,
        },
        token
      );
      if (paymentMethod === "bank") {
        toast.success("Bank transfer initiated! Check details below.");
        await clearCart();
      } else if (paymentMethod === "mobilemoney") {
        if (res.data?.authorization?.redirect) {
          toast.success("Redirecting to Mobile Money payment...");
          await clearCart();
          window.location.href = res.data.authorization.redirect;
        } else {
          toast.error("Failed to initiate Mobile Money payment.");
        }
      } else if (paymentMethod === "card") {
        if (res.data?.auth_url && res.data?.auth_url !== "N/A") {
          toast.success("Redirecting to Card payment...");
          await clearCart();
          window.location.href = res.data.auth_url;
        } else {
          toast.success("Card payment initiated!");
          await clearCart();
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    try {
      await updateQuantity(cartItemId, newQuantity);
      toast.success("Quantity updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  // Show loading state
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !cart) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty cart
  if (!cart || cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart
          </h1>
          <div className="text-center py-12">
            <PackageCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId || item.id}
                  className="p-6 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center gap-6">
                    <Image
                      src={getFallbackImage(item.image, "product")}
                      width={100}
                      height={100}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.category}
                      </p>
                      {item.dimensions && (
                        <p className="text-sm text-gray-500">
                          Dimensions: {item.dimensions}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Weight: {item.weight}kg
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {`RWF ${(item.price * item.quantity).toLocaleString()}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cartItemId || item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={isLoading}
                          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cartItemId || item.id,
                              item.quantity + 1
                            )
                          }
                          disabled={isLoading}
                          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveItem(item.cartItemId || item.id)
                        }
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    RWF {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supply</span>
                  <span className="font-semibold">
                    Able to supply on large quantity
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      RWF {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              {/* Payment Method Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={loading || isLoading}
                >
                  <option value="mobilemoney">MTN MOMO</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank</option>
                </select>
              </div>
              <button
                onClick={async () => {
                  if (paymentMethod === "bank") {
                    // Do the same as before, but redirect to the placeholder link
                    window.location.href =
                      "https://flutterwave.com/pay/sample-link";
                  } else {
                    await handleCheckout();
                  }
                }}
                disabled={loading || isLoading || cartItems.length === 0}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                  hover:bg-blue-700 transition-colors ${
                    loading || isLoading || cartItems.length === 0
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
              >
                {loading || isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
              {/* Benefits */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Best quality service is our priority</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <PackageCheck className="h-5 w-5 text-green-600" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
