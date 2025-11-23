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
import { orderService } from "@/app/services/orderService";
import { useUserStore } from "@/store/userStore";
import { getCheckoutDetails } from "@/app/services/cartService";

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

  const userEmail = useUserStore((state) => state.email);
  // You may need to add phone_number to your user store if not present
  // For now, fallback to a hardcoded value if not available
  const userPhone = "250791322102";

  function generateTxRef() {
    // Generates a tx_ref like tx-123456 with a random 6-digit number
    return `tx-${Math.floor(100000 + Math.random() * 900000)}`;
  }

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
      // 0. Get checkout details and log to console
      // const checkoutDetails = await getCheckoutDetails(cart.id, token);
      // console.log("[CHECKOUT DETAILS]", checkoutDetails);
      // 1. Place the order
      const response = await orderService.placeOrder(cart.id, "string", token);
      if (!response.data?.id) throw new Error("Order creation failed");
      toast.success("Order placed successfully!");
      // 2. Prepare payment payload
      const order = response.data;
      const firstCartItem = cartItems[0];
      if (!firstCartItem) throw new Error("No cart items found");
      // Get sellerId from product (from cartService types)
      const sellerId =
        (cart && cart.items && cart.items[0]?.product?.sellerId) || undefined;
      if (!sellerId) throw new Error("Seller ID not found in product");
      const tx_ref = generateTxRef();
      const amount = order.total;
      const order_id = order.id;
      const narration = `Payment for order ${order.id}`;
      // Persist for redirect handling
      if (typeof window !== "undefined") {
        localStorage.setItem("lastOrderId", order_id);
        localStorage.setItem("lastTxRef", tx_ref);
        localStorage.setItem("lastCartId", cart.id); // Store cartId for payment-complete page
      }
      // 3. Initiate payment
      const baseUrl = getBaseUrl();
      // Get user info from localStorage if available
      let localUserEmail = userEmail || "";
      let localUserPhone = userPhone || "";
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            if (userObj.email) localUserEmail = userObj.email;
            if (userObj.phone_number) localUserPhone = userObj.phone_number;
          } catch {}
        }
      }
      const paymentRes: any = await initiateSplitPayment({
        sellerId,
        paymentType: "card",
        tx_ref,
        amount,
        currency: "RWF",
        redirect_url: `${baseUrl}/payment-complete`,
        order_id,
        email: localUserEmail,
        phone_number: localUserPhone, // Now from localStorage if available
        narration,
        token,
        customizations: {
          title: "Construct kvv",
          description: "Payment services",
          logo: `${baseUrl}/favicon.ico`,
        },
      });
      if (paymentRes.data?.link) {
        toast.success("Redirecting to payment...");
        window.location.href = paymentRes.data.link;
      } else {
        throw new Error("Failed to get payment link");
      }
    } catch (err: any) {
      toast.error(err?.message || "Order or payment failed.");
    } finally {
      setLoading(false);
    }
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

  // Add this function to handle order deletion
  const handleDeleteOrder = async (orderId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;
    setOrderLoading(orderId);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork-production.up.railway.app';
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
    <div className="min-h-screen py-6 sm:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-gray-200">
              {cartItems.map((items) => (
                <div
                  key={items.cartItemId || items.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  <Image
                    src={getFallbackImage(
                      (Array.isArray(items.image)
                        ? typeof items.image[0] === "string"
                          ? items.image[0]
                          : items.image.find((img: any) => img?.isDefault)
                              ?.url || items.image[0]?.url
                        : undefined) ||
                        (Array.isArray((items as any).images)
                          ? typeof (items as any).images[0] === "string"
                            ? (items as any).images[0]
                            : (items as any).images.find(
                                (img: any) => img?.isDefault
                              )?.url || (items as any).images[0]?.url
                          : undefined) ||
                        (Array.isArray((items as any).product?.images)
                          ? (items as any).product.images.find(
                              (img: any) => img?.isDefault
                            )?.url || (items as any).product.images[0]?.url
                          : undefined) ||
                        "",
                      "product"
                    )}
                    width={100}
                    height={100}
                    alt={items.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 w-full">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {items.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">
                      {items.category}
                    </p>
                    {items.dimensions && (
                      <p className="text-xs sm:text-sm text-gray-500">
                        Dimensions: {items.dimensions}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      Weight: {items.weight}kg
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                    <p className="text-base sm:text-lg font-semibold text-gray-900">
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
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs sm:text-sm disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-6 flex flex-col gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Subtotal</span>
                  <span className="font-semibold text-sm">
                    RWF {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Supply</span>
                  <span className="font-semibold text-sm">
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
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm sm:text-base
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
                  "Place Order & Checkout"
                )}
              </button>
              {/* Benefits */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Best quality service is our priority</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <PackageCheck className="h-5 w-5 text-green-600" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Orders Section */}
        {pendingOrders.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
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
                    <span className="text-gray-900 font-mono text-xs break-all">
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
                    <span className="text-lg font-bold text-yellow-600">
                      RWF {order.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                        statusColors[order.status] ||
                        "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {order.status}
                    </span>
                    <select
                      className="ml-0 sm:ml-2 border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={order.status}
                      disabled={orderLoading === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {orderLoading === order.id && (
                      <Loader2 className="h-4 w-4 animate-spin ml-2 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Items:</span>
                    <ul className="ml-4 list-disc text-gray-700 text-xs sm:text-sm">
                      {order.items.map((item: any) => (
                        <li key={item.id}>
                          {item.product?.name || "Product"} x{item.quantity}{" "}
                          (RWF {item.price.toLocaleString()})
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    disabled={orderLoading === order.id}
                    className="ml-2 text-red-600 hover:text-red-700 flex items-center gap-1 text-xs sm:text-sm disabled:opacity-50 transition-transform transform hover:scale-110 hover:bg-red-50 rounded-full p-1"
                    title="Delete Order"
                  >
                    {orderLoading === order.id ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Trash2 className="h-6 w-6 transition-colors" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
