"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

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

  // PATCH order status to PAID if payment is successful
  useEffect(() => {
    if (status === "successful" && orderId && !statusPatched) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      fetch(
        `https://construct-kvv-bn-fork.onrender.com/api/v1/orders/${orderId}/status`,
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
        .then(() => setStatusPatched(true))
        .catch(() => setStatusPatched(true)); // Don't block UI on error
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
    fetch(
      `https://construct-kvv-bn-fork.onrender.com/api/v1/orders/${orderId}`,
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
        if (data && data.data) {
          setOrder(data.data);
        } else {
          setError("Order not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  const handleDownloadReceipt = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Receipt", 14, 18);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 14, 30);
    doc.text(`Transaction ID: ${transaction_id}`, 14, 38);
    doc.text(`Payment Status: ${status}`, 14, 46);
    doc.text("Items:", 14, 56);
    let y = 64;
    order.items.forEach((item: any, idx: number) => {
      doc.text(
        `${idx + 1}. ${item.product?.name || "Product"} x${
          item.quantity
        } (RWF ${item.price.toLocaleString()})`,
        16,
        y
      );
      y += 8;
    });
    doc.text(`Total: RWF ${order.total.toLocaleString()}`, 14, y + 6);
    doc.save(`receipt-${orderId}.pdf`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          minWidth: 340,
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        {loading ? (
          <div>Loading order details...</div>
        ) : error ? (
          <div style={{ color: "#e53e3e" }}>❌ {error}</div>
        ) : status === "successful" ? (
          <>
            <div style={{ fontSize: 32, color: "#22c55e" }}>
              ✅ Payment Successful
            </div>
            <div style={{ margin: "16px 0 8px", fontWeight: 600 }}>
              Order ID: {orderId}
            </div>
            <div style={{ marginBottom: 16 }}>
              Transaction ID: {transaction_id}
            </div>
            <div
              style={{
                textAlign: "left",
                margin: "0 auto 16px",
                background: "#f3f4f6",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                Order Items:
              </div>
              <ul style={{ paddingLeft: 18 }}>
                {order.items.map((item: any) => (
                  <li key={item.id}>
                    {item.product?.name || "Product"} x{item.quantity} (RWF{" "}
                    {item.price.toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>
              Total: RWF {order.total.toLocaleString()}
            </div>
            <button
              onClick={handleDownloadReceipt}
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 6,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              Download Receipt (PDF)
            </button>
          </>
        ) : (
          <div style={{ color: "#e53e3e", fontSize: 24 }}>
            ❌ Payment Failed or Cancelled
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCompletePage;
