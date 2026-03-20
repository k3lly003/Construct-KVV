"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import { getCheckoutDetails } from "@/app/services/cartService";

const PaymentCompletePage: React.FC = () => {
  const searchParams = useSearchParams();
  
  // Backwards-compatible param reading
  const status =
    searchParams.get("status") ||           // Intouch
    searchParams.get("payment_status");      // Flutterwave

  const transactionId = searchParams.get("transaction_id");  // same for both

  const reference =
    searchParams.get("reference") ||         // Intouch
    searchParams.get("tx_ref");              // Flutterwave

  const orderId = searchParams.get("order_id");

  // Normalize status string
  const isSuccess =
    status?.toLowerCase() === "successful" ||
    status?.toLowerCase() === "completed";

  // Use lastOrderId from localStorage if available, otherwise fallback to reference
  let finalOrderId: string | null = orderId;
  if (!finalOrderId && typeof window !== "undefined") {
    finalOrderId = localStorage.getItem("lastOrderId") || (reference as string);
  }
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusPatched, setStatusPatched] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<any>(null);

  // PATCH order status to PAID if payment is successful
  useEffect(() => {
    if (isSuccess && finalOrderId && !statusPatched) {
      console.log("[PaymentComplete] Patching order status to PAID", {
        orderId: finalOrderId,
      });
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork.onrender.com';
      fetch(
        `${API_URL}/api/v1/orders/${finalOrderId}/status`,
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
  }, [isSuccess, finalOrderId, statusPatched]);

  // Fetch checkout details after payment is successful and status is patched
  useEffect(() => {
    if (isSuccess && finalOrderId && statusPatched) {
      console.log("[PaymentComplete] Ready to fetch checkout details", {
        orderId: finalOrderId,
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
  }, [isSuccess, finalOrderId, statusPatched]);

  useEffect(() => {
    if (!finalOrderId) return;
    setLoading(true);
    // Get authToken from localStorage if available
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
    }
    console.log("[PaymentComplete] Fetching order details", { orderId: finalOrderId, token });
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(
      `${API_URL}/api/v1/orders/${finalOrderId}`,
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
  }, [finalOrderId]);

  const handleDownloadReceipt = () => {
    console.log("[PaymentComplete] Downloading receipt");
    if (!order) return;

    const doc = new jsPDF();
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    const logoPath = "/kvv-logo.png";

    // Get user name from localStorage or order
    let userName = "";
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          // Keep existing logic, but add firstName/lastName as an additional fallback
          userName = userObj.name || userObj.fullName || userObj.email || "";

          if (
            !userName &&
            (userObj.firstName || userObj.lastName)
          ) {
            userName = `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim();
          }
        } catch {}
      }
    }
    if (!userName && order?.user?.name) userName = order.user.name;

    const orderIdSafe = finalOrderId ? String(finalOrderId) : "";
    const transactionIdSafe = transactionId ? String(transactionId) : "";
    const referenceSafe = reference ? String(reference) : "";
    const orderTotal = typeof order?.total === "number" ? order.total : 0;

    // HEADER BAR
    doc.setFillColor(255, 193, 7);
    doc.rect(0, 0, 210, 38, "F");

    // LOGO
    try {
      doc.addImage(logoPath, "PNG", 10, 5, 28, 28);
    } catch (e) {
      // If logo fails, still generate the PDF
    }

    // COMPANY NAME in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Construct KVV", 46, 17);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Receipt", 46, 26);

    // START y = 50
    let y = 50;

    // DETAILS SECTION
    const writeDetailRow = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(label, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 65, y);
      y += 8;
    };

    writeDetailRow("Order ID:", orderIdSafe);
    writeDetailRow("Transaction ID:", transactionIdSafe);
    writeDetailRow("Reference:", referenceSafe);
    writeDetailRow("Customer:", userName || "N/A");
    writeDetailRow("Date:", dateStr);
    writeDetailRow("Status:", "Successful");

    // DIVIDER
    doc.setDrawColor(255, 193, 7);
    doc.setLineWidth(0.8);
    doc.line(14, y + 6, 196, y + 6);
    y += 16;

    const items: any[] = Array.isArray(order?.items) ? order.items : [];

    // ITEMS TABLE HEADER ROW
    doc.setFillColor(255, 193, 7);
    doc.rect(14, y - 7, 182, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("#", 16, y);
    doc.text("Product", 40, y);
    doc.text("Qty", 112, y);
    doc.text("Unit Price", 140, y);
    doc.text("Subtotal", 168, y, { align: "right" });
    y += 8;

    // ITEMS ROWS
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    items.forEach((item: any, idx: number) => {
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 255, isEven ? 253 : 255, isEven ? 231 : 255);
      doc.rect(14, y - 6, 182, 9, "F");

      const productName = String(item?.product?.name || item?.name || "Product");
      const productSafe =
        productName.length > 26 ? `${productName.slice(0, 23)}...` : productName;

      const qty = typeof item?.quantity === "number" ? item.quantity : 0;
      const unitPrice = typeof item?.price === "number" ? item.price : 0;
      const subtotal = unitPrice * qty;

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(String(idx + 1), 16, y);
      doc.text(productSafe, 40, y);
      doc.text(String(qty), 112, y);
      doc.text(`RWF ${unitPrice.toLocaleString()}`, 140, y);
      doc.text(`RWF ${subtotal.toLocaleString()}`, 168, y, { align: "right" });

      y += 9;
    });

    // TOTAL ROW
    y += 6;
    doc.setFillColor(255, 193, 7);
    doc.rect(14, y - 6, 182, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("TOTAL", 16, y + 2);
    doc.text(`RWF ${orderTotal.toLocaleString()}`, 168, y + 2, { align: "right" });
    y += 20;

    // THANK YOU LINE
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for choosing Construct KVV!", 105, y, { align: "center" });
    y += 14;

    // CONTACT SECTION BOX
    doc.setFillColor(248, 248, 248);
    doc.rect(14, y, 182, 28, "F");
    doc.setDrawColor(220, 220, 220);
    doc.rect(14, y, 182, 28, "S");
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Contact Us", 105, y + 9, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("+250 785 648 616", 105, y + 17, { align: "center" });
    doc.text(
      "For any payment issues or inquiries, we are here to help.",
      105,
      y + 24,
      { align: "center" }
    );

    // SAVE
    doc.save("receipt-" + orderIdSafe + ".pdf");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1] p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-[480px] w-full p-10 text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#FFC107] border-t-transparent rounded-full mb-4" />
            <div className="text-gray-500 text-sm">Loading order details...</div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-100 mx-auto mb-6 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</div>
            <div className="text-sm text-gray-500 mb-6">
              Your payment could not be processed. Please try again.
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
              {error ||
                "If you were charged, please contact support with your MoMo transaction ID."}
            </div>
            <div className="text-sm text-gray-500 mt-4">📞 +250 785 648 616</div>
          </div>
        ) : isSuccess ? (
          <>
            <div className="w-20 h-20 rounded-full bg-[#FFC107] mx-auto mb-6 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Your order has been confirmed and is being processed.
            </div>

            <div className="bg-[#FFFDE7] border border-[#FFC107] rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between text-sm py-2 border-b border-yellow-100">
                <span className="text-gray-700 font-medium">Order ID</span>
                <span className="text-gray-900 font-semibold">{finalOrderId}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-yellow-100">
                <span className="text-gray-700 font-medium">Transaction ID</span>
                <span className="text-gray-900 font-semibold">{transactionId}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-yellow-100">
                <span className="text-gray-700 font-medium">Status</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  Successful
                </span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-gray-700 font-medium">Date</span>
                <span className="text-gray-900 font-semibold">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="text-left">
              <div className="text-sm font-semibold text-gray-600 mb-3">
                Order Items
              </div>
              {(order?.items || []).map((item: any) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 mb-2 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {item.product?.name || "Product"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-700">
                    RWF {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center bg-[#FFC107] rounded-xl p-4 mb-6">
              <span className="font-bold text-white text-base">Total Amount</span>
              <span className="font-bold text-white text-xl">
                RWF {order?.total?.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-white font-bold py-3 px-6 rounded-xl text-base cursor-pointer border-none transition-colors animate-pulse"
            >
              ⬇ Download Receipt (PDF)
            </button>

            <div className="text-xs text-gray-400 mt-4">
              Need help? Call us: +250 785 648 616
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-100 mx-auto mb-6 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Your payment could not be processed. Please try again.
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
              If you were charged, please contact support with your MoMo transaction ID.
            </div>
            <div className="text-sm text-gray-500 mt-4">
              📞 +250 785 648 616
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCompletePage;
