"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import { getCheckoutDetails } from "@/app/services/cartService";

const PaymentCompletePage: React.FC = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");
  // Use lastOrderId from localStorage if available, otherwise fallback to tx_ref
  let orderId: string | null = null;
  if (typeof window !== "undefined") {
    orderId = localStorage.getItem("lastOrderId") || (tx_ref as string);
  }
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusPatched, setStatusPatched] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<any>(null);

  // PATCH order status to PAID if payment is successful
  useEffect(() => {
    if (status === "successful" && orderId && !statusPatched) {
      console.log("[PaymentComplete] Patching order status to PAID", {
        orderId,
      });
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork-production.up.railway.app';
      fetch(
        `${API_URL}/api/v1/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: "PAID" }),
        }
      )
        .then((res) => res.json())
        .then(() => {
          console.log("[PaymentComplete] Order status patched to PAID");
          setStatusPatched(true);
        })
        .catch(() => {
          console.log(
            "[PaymentComplete] Failed to patch order status, but continuing"
          );
          setStatusPatched(true);
        });
    }
  }, [status, orderId, statusPatched]);

  // Fetch checkout details after payment is successful and status is patched
  useEffect(() => {
    if (status === "successful" && orderId && statusPatched) {
      console.log("[PaymentComplete] Ready to fetch checkout details", {
        orderId,
        statusPatched,
      });
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      const cartId =
        typeof window !== "undefined"
          ? localStorage.getItem("lastCartId")
          : null;
      if (cartId && token) {
        console.log("[PaymentComplete] Calling getCheckoutDetails", {
          cartId,
          token,
        });
        getCheckoutDetails(cartId, token)
          .then((data) => {
            console.log("[PaymentComplete] getCheckoutDetails response", data);
            setCheckoutDetails(data);
          })
          .catch((err) => {
            console.log("[PaymentComplete] getCheckoutDetails error", err);
            setCheckoutDetails(null);
          });
      } else {
        console.log(
          "[PaymentComplete] Missing cartId or token for getCheckoutDetails",
          { cartId, token }
        );
      }
    }
  }, [status, orderId, statusPatched]);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    // Get authToken from localStorage if available
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
    }
    console.log("[PaymentComplete] Fetching order details", { orderId, token });
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork-production.up.railway.app';
    fetch(
      `${API_URL}/api/v1/orders/${orderId}`,
      {
        headers: token
          ? {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            }
          : { accept: "*/*" },
      }
    )
      .then((res) => {
        if (!res.ok)
          throw new Error(
            res.status === 401
              ? "Unauthorized. Please sign in."
              : "Order not found"
          );
        return res.json();
      })
      .then((data) => {
        console.log("[PaymentComplete] Order details fetched", data);
        if (data && data.data) {
          setOrder(data.data);
        } else {
          setError("Order not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("[PaymentComplete] Error fetching order details", err);
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  const handleDownloadReceipt = () => {
    console.log("[PaymentComplete] Downloading receipt");
    if (!order) return;
    const doc = new jsPDF();
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    // Get user name from localStorage or order
    let userName = "";
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userName = userObj.name || userObj.fullName || userObj.email || "";
        } catch {}
      }
    }
    if (!userName && order?.user?.name) userName = order.user.name;
    doc.setFontSize(18);
    doc.text("Payment Receipt", 14, 18);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 14, 30);
    doc.text(`Transaction ID: ${transaction_id}`, 14, 38);
    doc.text(`Payment Status: ${status}`, 14, 46);
    doc.text(`Customer: ${userName}`, 14, 54);
    doc.text(`Date: ${dateStr}`, 14, 62);
    // Table header
    let y = 72;
    doc.setFontSize(13);
    doc.text("Items:", 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFillColor(230, 230, 250);
    doc.rect(14, y - 6, 180, 8, "F");
    doc.text("#", 16, y);
    doc.text("Product", 24, y);
    doc.text("Qty", 100, y);
    doc.text("Price", 120, y);
    doc.text("Subtotal", 150, y);
    y += 7;
    order.items.forEach((item: any, idx: number) => {
      doc.text(`${idx + 1}`, 16, y);
      doc.text(`${item.product?.name || "Product"}`, 24, y);
      doc.text(`${item.quantity}`, 100, y);
      doc.text(`RWF ${item.price.toLocaleString()}`, 120, y);
      doc.text(`RWF ${(item.price * item.quantity).toLocaleString()}`, 150, y);
      y += 7;
    });
    y += 4;
    // Highlight total
    doc.setFontSize(13);
    doc.setTextColor(34, 197, 94); // green
    doc.setFont("helvetica", "bold");
    doc.text(`Total: RWF ${order.total.toLocaleString()}`, 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.save(`receipt-${orderId}.pdf`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm min-w-[340px] max-w-[400px] text-center">
        {loading ? (
          <div>Loading order details...</div>
        ) : error ? (
          <div className="text-error-600">❌ {error}</div>
        ) : status === "successful" ? (
          <>
            <div className="text-mid text-success-600">
              ✅ Payment Successful
            </div>
            <div className="my-4 font-semibold">
              Order ID: {orderId}
            </div>
            <div className="mb-4">
              Transaction ID: {transaction_id}
            </div>
            <div className="text-left mx-auto mb-4 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold mb-2">
                Order Items:
              </div>
              <ul className="pl-5">
                {order.items.map((item: any) => (
                  <li key={item.id}>
                    {item.product?.name || "Product"} x{item.quantity} (RWF{" "}
                    {item.price.toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
            <div className="font-semibold mb-4">
              Total: RWF {order.total.toLocaleString()}
            </div>
            <button
              onClick={handleDownloadReceipt}
              className="bg-info-600 text-white px-5 py-2.5 rounded-md font-semibold border-none cursor-pointer mt-2 hover:bg-info-700 transition-colors"
            >
              Download Receipt (PDF)
            </button>
          </>
        ) : (
          <div className="text-mid text-error-600">
            ❌ Payment Failed or Cancelled
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCompletePage;
