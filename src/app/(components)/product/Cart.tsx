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
import { GenericButton } from "@/components/ui/generic-button";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getFallbackImage } from "@/app/utils/imageUtils";
import { useTranslations } from "@/app/hooks/useTranslations";
import { orderService } from "@/app/services/orderService";
import { MomoPaymentModal } from "../MomoPaymentModal";

export const CartPage: React.FC = () => {
  const {
    cartItems,
    cart,
    isLoading,
    error,
    fetchCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [isMomoModalOpen, setIsMomoModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslations();

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

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost") {
        return "http://localhost:3001";
      } else {
        return "https://www.constructkvv.com";
      }
    }
    return "https://www.constructkvv.com";
  };

  const handlePlaceOrder = async () => {
    if (!cart?.id) return;
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token) {
        toast.error("You must be logged in to checkout.");
        setLoading(false);
        setTimeout(() => {
          router.push("/signin");
        }, 1200);
        return;
      }
      // 1. Place the order
      const response = await orderService.placeOrder(cart.id, "string", token);
      if (!response.data?.id) throw new Error("Order creation failed");
      toast.success("Order placed successfully!");
      
      // 2. Set current order ID and open MoMo modal
      const order = response.data;
      setCurrentOrderId(order.id);
      setIsMomoModalOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "Order creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (transactionId: string, reference: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null;
    if (token && currentOrderId) {
      await orderService.updateOrderStatus(currentOrderId, "PAID", token);
      clearCart();
      setIsMomoModalOpen(false);
      router.push(
        `/payment-complete?status=successful&transaction_id=${transactionId}&reference=${reference}&order_id=${currentOrderId}` 
      );
    } else {
    }
  };

  const handlePaymentFailure = (message: string) => {
    router.push(`/payment-complete?status=failed&order_id=${currentOrderId}`);
  };

  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [orderLoading, setOrderLoading] = useState<string | null>(null);
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    CANCELLED: "bg-red-100 text-red-700 border-red-300",
  };
  const statusOptions = ["PENDING", "CANCELLED"];

  const fetchPendingOrders = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;
    try {
      const res: any = await orderService.getMyOrders(token);
      const orders = res.data?.orders || [];
      setPendingOrders(orders.filter((o: any) => o.status === "PENDING"));
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;
    setOrderLoading(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus, token);
      await fetchPendingOrders();
      toast.success("Order status updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setOrderLoading(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;
    setOrderLoading(orderId);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork.onrender.com';
      const res = await fetch(
        `${API_URL}/api/v1/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Your order has been deleted");
        await fetchPendingOrders();
      } else {
        throw new Error(data.message || "Failed to delete order");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete order");
    } finally {
      setOrderLoading(null);
    }
  };

  // Show loading state
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
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
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty cart but still show pending orders if they exist
  if (!cart || cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-title font-bold text-gray-900 mb-8">
            {t("cart.title")}
          </h1>
          
          {/* Empty Cart Message */}
          <div className="text-center py-12 mb-8">
            <PackageCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-mid font-semibold text-gray-900 mb-2">
              {t("cart.empty")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("cart.emptySubtitle")}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
            >
              {t("cart.continueShopping")}
            </button>
          </div>

          {/* Pending Orders Section - Always show if there are pending orders */}
          {pendingOrders.length > 0 && (
            <div className="mt-10 sm:mt-12">
              <h2 className="text-mid sm:text-mid font-semibold text-gray-900 mb-6">
                Pending Orders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl shadow-lg bg-white p-4 sm:p-6 border border-gray-200 flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <span className="font-semibold text-gray-700">
                        Order ID:
                      </span>
                      <span className="text-gray-900 font-mono text-small break-all">
                        {order.id}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <span className="font-semibold text-gray-700">
                        Created At:
                      </span>
                      <span className="text-gray-700">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <span className="font-semibold text-gray-700">Total:</span>
                      <span className="text-mid font-bold text-yellow-600">
                        RWF {order.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-700">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full border text-small font-semibold ${
                          statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    {/* Status Change Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          disabled={orderLoading === order.id || order.status === status}
                          className={`px-3 py-1 rounded text-small font-medium transition-colors ${
                            orderLoading === order.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          } ${
                            order.status === status
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : statusColors[status] || "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {orderLoading === order.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            status
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={orderLoading === order.id}
                        className={`px-3 py-1 rounded text-small font-medium text-red-600 border border-red-300 hover:bg-red-50 transition-colors ${
                          orderLoading === order.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {orderLoading === order.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <h1 className="text-title font-bold text-gray-900 mb-6 sm:mb-8">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-gray-200">
              {cartItems.map((items) => {
                // Use same image logic as ProductCard for consistency
                const imageUrl = getFallbackImage(
                  items.image, // Primary image field from LocalCartItem
                  "product"
                );

                return (
                  <div
                    key={items.cartItemId || items.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewImage(imageUrl)}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <Image
                        src={imageUrl}
                        width={100}
                        height={100}
                        alt={items.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div className="flex-1 w-full">
                    <h3 className="text-base sm:text-mid font-semibold text-gray-900">
                      {items.name}
                    </h3>
                    <p className="text-small sm:text-small text-gray-500 mb-1">
                      {items.category}
                    </p>
                    {items.dimensions && (
                      <p className="text-small sm:text-small text-gray-500">
                        Dimensions: {items.dimensions}
                      </p>
                    )}
                    <p className="text-small sm:text-small text-gray-500">
                      Weight: {items.weight}kg
                    </p>
                  </div>
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                    <p className="text-base sm:text-mid font-semibold text-gray-900">
                      {`RWF ${(items.price * items.quantity).toLocaleString()}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (!items.cartItemId) {
                            toast.error(
                              "Missing cart item id; refresh your cart."
                            );
                            return;
                          }
                          handleUpdateQuantity(
                            items.cartItemId,
                            Math.max(1, items.quantity - 1)
                          );
                        }}
                        disabled={
                          isLoading || !items.cartItemId || items.quantity <= 1
                        }
                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{items.quantity}</span>
                      <button
                        onClick={() => {
                          if (!items.cartItemId) {
                            toast.error(
                              "Missing cart item id; refresh your cart."
                            );
                            return;
                          }
                          handleUpdateQuantity(
                            items.cartItemId,
                            items.quantity + 1
                          );
                        }}
                        disabled={isLoading || !items.cartItemId}
                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        if (!items.cartItemId) {
                          toast.error(
                              "Missing cart item id; refresh your cart."
                            );
                            return;
                          }
                        handleRemoveItem(items.cartItemId);
                      }}
                      disabled={isLoading || !items.cartItemId}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-small sm:text-small disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-6 flex flex-col gap-4">
              <h2 className="text-mid font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-small">Subtotal</span>
                  <span className="font-semibold text-small">
                    RWF {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-small">Supply</span>
                  <span className="font-semibold text-small">
                    Able to supply on large quantity
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-base font-semibold">
                      RWF {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || isLoading || cartItems.length === 0}
                className={`w-full bg-amber-600 text-white py-3 rounded-lg font-semibold text-small sm:text-base
                  hover:bg-amber-700 transition-colors ${
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
                  "Place Order & Checkout"
                )}
              </button>
              {/* Benefits */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-small sm:text-small text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Best quality service is our priority</span>
                </div>
                <div className="flex items-center gap-2 text-small sm:text-small text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-2 text-small sm:text-small text-gray-600">
                  <PackageCheck className="h-5 w-5 text-green-600" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Orders Section - Always show if there are pending orders */}
        {pendingOrders.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-mid sm:text-mid font-semibold text-gray-900 mb-6">
              Pending Orders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl shadow-lg bg-white p-4 sm:p-6 border border-gray-200 flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                    <span className="font-semibold text-gray-700">
                      Order ID:
                    </span>
                    <span className="text-gray-900 font-mono text-small break-all">
                      {order.id}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <span className="font-semibold text-gray-700">
                        Created At:
                      </span>
                      <span className="text-gray-700">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <span className="font-semibold text-gray-700">Total:</span>
                    <span className="text-mid font-bold text-yellow-600">
                      RWF {order.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full border text-small font-semibold ${
                        statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  {/* Status Change Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status)}
                        disabled={orderLoading === order.id || order.status === status}
                        className={`px-3 py-1 rounded text-small font-medium transition-colors ${
                          orderLoading === order.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        } ${
                          order.status === status
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : statusColors[status] || "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {orderLoading === order.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          status
                        )}
                      </button>
                    ))}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={orderLoading === order.id}
                      className={`px-3 py-1 rounded text-small font-medium text-red-600 border border-red-300 hover:bg-red-50 transition-colors ${
                        orderLoading === order.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {orderLoading === order.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MoMo Payment Modal */}
      <MomoPaymentModal
        isOpen={isMomoModalOpen}
        onClose={() => setIsMomoModalOpen(false)}
        amount={total}
        description={`Payment for order ${currentOrderId}`}
        customerName=""
        customerEmail=""
        sellerId=""
        orderId={currentOrderId || ""}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={previewImage}
              alt="Product preview"
              width={800}
              height={600}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
