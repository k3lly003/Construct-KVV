"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import { initialCartItems } from "@/app/utils/fakes/CartFakes";
import Image from "next/image";
import { initiateSplitPayment } from "@/app/services/paymentService";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  weight: number;
  dimensions?: string;
}

export const CartPage: React.FC = () => {
  const { cartItems, setCartItems, updateQuantity, removeFromCart, clearCart } =
    useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "mobilemoney" | "card" | "bank"
  >("mobilemoney");

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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // Always set supply to 49.99
  const supply = 0;
  // Total is 0 if subtotal is 0, otherwise subtotal + 49.99
  const total = subtotal === 0 ? 0 : subtotal;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      toast.error("You must be logged in to pay.");
      setLoading(false);
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
        clearCart();
      } else if (paymentMethod === "mobilemoney") {
        if (res.data?.authorization?.redirect) {
          toast.success("Redirecting to Mobile Money payment...");
          clearCart();
          window.location.href = res.data.authorization.redirect;
        } else {
          toast.error("Failed to initiate Mobile Money payment.");
        }
      } else if (paymentMethod === "card") {
        if (res.data?.auth_url && res.data?.auth_url !== "N/A") {
          toast.success("Redirecting to Card payment...");
          clearCart();
          window.location.href = res.data.auth_url;
        } else {
          toast.success("Card payment initiated!");
          clearCart();
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  // Display cart items in reverse order (most recently added first)
  const reversedCartItems = [...cartItems].reverse();

  // Remove the standalone Flutterwave section and restore the order summary and payment method dropdown.
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {reversedCartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center gap-6">
                    <Image
                      src={item.image}
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
                        {typeof item.category === "string"
                          ? item.category
                          : item.category &&
                            typeof item.category === "object" &&
                            "name" in item.category
                          ? (item.category as { name?: string }).name || ""
                          : ""}
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
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
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
                  disabled={loading}
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
                disabled={loading || cartItems.length === 0}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                  hover:bg-blue-700 transition-colors ${
                    loading || cartItems.length === 0
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
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
