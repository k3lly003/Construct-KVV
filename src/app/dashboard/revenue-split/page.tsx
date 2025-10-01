"use client";

import { useEffect, useState } from "react";
import {
  revenueSplitService,
  SplitCalculation,
  Seller,
} from "@/app/services/RevenueSplitService";
import { toast } from "sonner";

export default function RevenueSplitPage() {
  const [splits, setSplits] = useState<SplitCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterChecked, setFilterChecked] = useState<
    "all" | "checked" | "unchecked"
  >("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [activeSeller, setActiveSeller] = useState<Seller | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    revenueSplitService
      .getSplitCalculations()
      .then((data) => {
        setSplits(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch split calculations");
        setLoading(false);
      });
  }, []);

  const handleCheck = async (id: string) => {
    setUpdatingId(id);
    try {
      const updated = await revenueSplitService.checkSplitCalculation(id);
      setSplits((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Transaction checked successfully!");
    } catch (err) {
      toast.error("Failed to update check status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenSeller = async (sellerId: string) => {
    setSellerLoading(true);
    setSellerModalOpen(true);
    try {
      const seller = await revenueSplitService.getSellerById(sellerId);
      setActiveSeller(seller);
    } catch (e) {
      setActiveSeller(null);
      toast.error("Failed to load seller info");
    } finally {
      setSellerLoading(false);
    }
  };

  const initials = (first?: string, last?: string) => {
    const a = (first || "").trim().charAt(0).toUpperCase();
    const b = (last || "").trim().charAt(0).toUpperCase();
    return a + b || "--";
  };

  const filteredSplits = splits.filter((s) => {
    if (filterChecked === "all") return true;
    if (filterChecked === "checked") return s.checked;
    if (filterChecked === "unchecked") return !s.checked;
    return true;
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Revenue Split
      </h1>
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors duration-150 ${
            filterChecked === "all"
              ? "bg-amber-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setFilterChecked("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors duration-150 ${
            filterChecked === "checked"
              ? "bg-amber-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setFilterChecked("checked")}
        >
          Checked
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors duration-150 ${
            filterChecked === "unchecked"
              ? "bg-amber-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setFilterChecked("unchecked")}
        >
          Unchecked
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Check</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Gross</th>
                <th className="px-4 py-2">Net</th>
                <th className="px-4 py-2">Split Ratio</th>
                <th className="px-4 py-2">Commission</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSplits.map((split) => (
                <tr
                  key={split.id}
                  className={
                    split.checked
                      ? "bg-green-50 dark:bg-green-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  }
                  onClick={() => handleOpenSeller(split.sellerId)}
                >
                  <td
                    className="px-4 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={split.checked}
                      disabled={split.checked || updatingId === split.id}
                      onChange={() => handleCheck(split.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{split.sellerName}</td>
                  <td className="px-4 py-2">
                    RWF {split.grossAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    RWF {split.netAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {(split.splitRatio * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-2">
                    RWF {split.platformCommission.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 font-bold text-amber-700 dark:text-amber-400">
                    RWF {split.totalAmount.toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-2 text-xs"
                    style={{ fontSize: "1rem" }}
                  >
                    {new Date(split.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sellerModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Seller Details</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSellerModalOpen(false)}
              >
                ✕
              </button>
            </div>
            {sellerLoading ? (
              <div>Loading seller info...</div>
            ) : activeSeller ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                    {initials(
                      activeSeller.user?.firstName,
                      activeSeller.user?.lastName
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {activeSeller.businessName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeSeller.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Owner:</span>{" "}
                    {activeSeller.ownerName}
                  </div>
                  <div>
                    <span className="font-semibold">Business Address:</span>{" "}
                    {activeSeller.businessAddress}
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {activeSeller.user?.phone}
                  </div>
                  <div>
                    <span className="font-semibold">Business Phone:</span>{" "}
                    {activeSeller.businessPhone}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-600">Seller not found.</div>
            )}
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                onClick={() => setSellerModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
