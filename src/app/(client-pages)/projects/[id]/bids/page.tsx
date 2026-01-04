"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, ArrowLeft } from "lucide-react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { NegotiationChat } from "@/app/dashboard/(components)/negotiation/NegotiationChat";

interface BidItem {
  id: string;
  finalProjectId: string;
  contractorId: string;
  amount: number;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  createdAt: string;
}

export default function ProjectBidsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [bids, setBids] = useState<BidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [negotiationBid, setNegotiationBid] = useState<BidItem | null>(null);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [selectedBid, setSelectedBid] = useState<BidItem | null>(null);
  const [finalAmount, setFinalAmount] = useState<string>("");
  const { role } = useUserStore();

  useEffect(() => {
    async function loadBids() {
      setLoading(true);
      setError(null);
      try {
        // Assuming backend supports filtering by final project id via query
        const res: any = await axiosInstance.get(`/api/v1/bids?finalProjectId=${projectId}`);
        const data = (res.data && (res.data.data ?? res.data)) || [];
        setBids(data);
      } catch (e: any) {
        setError(e.message || "Failed to load bids");
      } finally {
        setLoading(false);
      }
    }
    if (projectId) loadBids();
  }, [projectId]);

  async function refreshBids() {
    try {
      const res: any = await axiosInstance.get(`/api/v1/bids?finalProjectId=${projectId}`);
      const data = (res.data && (res.data.data ?? res.data)) || [];
      setBids(data);
    } catch {}
  }

  function openAcceptDialog(bid: BidItem) {
    setSelectedBid(bid);
    setFinalAmount(String(bid.amount || ""));
    setAcceptOpen(true);
  }

  async function handleAccept() {
    if (!selectedBid) return;
    // Sanitize and ensure numeric value
    const cleaned = String(finalAmount).trim().replace(/[,\sRWF]/g, "");
    const amountNumber = parseFloat(cleaned);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      toast.error("Please enter a valid final amount");
      return;
    }
    setAccepting(true);
    try {
      // Debug payload to verify number type
      console.log("Accepting bid payload:", { bidId: selectedBid.id, finalAmount: amountNumber, type: typeof amountNumber });
      await axiosInstance.post(`/api/v1/bids/${selectedBid.id}/accept`, { finalAmount: amountNumber });
      toast.success("Bid accepted successfully");
      setAcceptOpen(false);
      setSelectedBid(null);
      await refreshBids();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to accept bid");
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push(`/projects/${projectId}`)} className="border-amber-400 text-amber-700 hover:bg-amber-50">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Project
          </Button>
          <h1 className="text-mid font-bold text-amber-900">Project Bids</h1>
        </div>

        {loading ? (
          <div className="text-amber-700">Loading bids...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : bids.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-amber-400" />
            </div>
            <p className="text-amber-800 text-mid font-medium">No bids yet for this project.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <Card key={bid.id} className="border-l-4 border-l-amber-500">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        bid.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                        bid.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        bid.status === "WITHDRAWN" ? "bg-gray-100 text-gray-800" :
                        "bg-amber-100 text-amber-800"
                      }>
                        {bid.status}
                      </Badge>
                      <span className="text-small text-gray-500">{new Date(bid.createdAt).toLocaleString()}</span>
                    </div>
                    {bid.message && (
                      <p className="text-small text-gray-700 max-w-2xl">{bid.message}</p>
                    )}
                    <div className="mt-2">
                      <Link
                        href={`/professionals/contractor/${bid.contractorId}`}
                        className="inline-block border border-amber-400 text-amber-700 hover:bg-amber-50 px-3 py-1 rounded"
                      >
                        View Contractor Profile
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-mid font-semibold text-green-600">
                      {new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", minimumFractionDigits: 0 }).format(bid.amount)}
                    </span>
                    <Button
                      variant="outline"
                      className="border-amber-400 text-amber-700 hover:bg-amber-50"
                      onClick={() => { setNegotiationBid(bid); setNegotiationOpen(true); }}
                    >
                      Negotiate
                    </Button>
                    {role !== "CONTRACTOR" && (
                      <Button
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => openAcceptDialog(bid)}
                      >
                        Accept Bid
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Negotiation Drawer */}
      <Sheet open={negotiationOpen} onOpenChange={setNegotiationOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Negotiation</SheetTitle>
          </SheetHeader>
          {negotiationBid && (
            <NegotiationChat
              bidId={String(negotiationBid.id)}
              initialBidData={{
                id: negotiationBid.id,
                message: negotiationBid.message || "",
                amount: negotiationBid.amount,
                createdAt: negotiationBid.createdAt,
                sellerId: negotiationBid.contractorId,
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Accept Bid Dialog */}
      <Dialog open={acceptOpen} onOpenChange={setAcceptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accept Bid</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-small text-gray-600">Set the final agreed amount. This will close the project and notify all contractors.</p>
            <div>
              <label className="text-small font-medium text-gray-700">Final Amount (RWF)</label>
              <Input type="number" value={finalAmount} onChange={(e) => setFinalAmount(e.target.value)} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptOpen(false)} disabled={accepting}>Cancel</Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleAccept} disabled={accepting}>
              {accepting ? "Accepting..." : "Accept Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


