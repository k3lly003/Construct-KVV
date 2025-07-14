"use client";

import { useEffect, useState } from "react";
import { SellerRequestService, SellerRequest } from "@/app/services/sellerRequestService";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from '@/app/hooks/useTranslations';
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';

export default function SellerRequestsPage() {
  const { t } = useTranslations();
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = getUserDataFromLocalStorage();
        const token = userData?.token;
        const data = await SellerRequestService.getAllRequests(token);
        setRequests(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(t(dashboardFakes.sellerRequest.fetchError));
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [t]);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(id + status);
    setActionError(null);
    try {
      const userData = getUserDataFromLocalStorage();
      const token = userData?.token;
      await SellerRequestService.updateRequestStatus(id, status, token);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err: any) {
      setActionError(status === "APPROVED" ? t(dashboardFakes.sellerRequest.approveError) : t(dashboardFakes.sellerRequests.rejectError));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t(dashboardFakes.sellerRequest.title)}</h1>
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">{t(dashboardFakes.sellerRequest.loading)}</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-400 py-8">{t(dashboardFakes.sellerRequest.noRequestsFound)}</div>
        ) : (
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t(dashboardFakes.sellerRequest.tableName)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tableEmail)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tablePhone)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tableBusinessName)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tableBusinessAddress)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tableBusinessPhone)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tableTaxId)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tableStatus)}</TableHead>
                <TableHead>{t(dashboardFakes.sellerRequest.tableSubmitted)}</TableHead>
                <TableHead className="text-center">{t(dashboardFakes.sellerRequest.tableActions)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-blue-50 transition rounded-xl">
                  <TableCell>{req.user.firstName} {req.user.lastName}</TableCell>
                  <TableCell>{req.user.email}</TableCell>
                  <TableCell>{req.user.phone}</TableCell>
                  <TableCell>{req.businessName}</TableCell>
                  <TableCell>{req.businessAddress}</TableCell>
                  <TableCell>{req.businessPhone}</TableCell>
                  <TableCell>{req.taxId}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === "PENDING" ? "secondary" : req.status === "APPROVED" ? "default" : "destructive"}>
                      {req.status === "PENDING" ? t(dashboardFakes.sellerRequest.statusPending) : 
                       req.status === "APPROVED" ? t(dashboardFakes.sellerRequest.statusApproved) : 
                       t(dashboardFakes.sellerRequest.statusRejected)}
                    </Badge>
                  </TableCell>
                  <TableCell>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-xs font-semibold shadow-sm disabled:opacity-50"
                        disabled={actionLoading === req.id + "APPROVED"}
                        onClick={() => handleAction(req.id, "APPROVED")}
                      >
                        {actionLoading === req.id + "APPROVED" ? t(dashboardFakes.sellerRequest.approving) : t(dashboardFakes.sellerRequests.approve)}
                      </button>
                      <button
                        className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-xs font-semibold shadow-sm disabled:opacity-50"
                        disabled={actionLoading === req.id + "REJECTED"}
                        onClick={() => handleAction(req.id, "REJECTED")}
                      >
                        {actionLoading === req.id + "REJECTED" ? t(dashboardFakes.sellerRequest.rejecting) : t(dashboardFakes.sellerRequests.reject)}
                      </button>
                    </div>
                    {actionError && (
                      <div className="text-xs text-red-500 mt-1">{actionError}</div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
} 