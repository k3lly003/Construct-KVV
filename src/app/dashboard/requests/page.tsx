// "use client";

// import { useEffect, useState } from "react";
// import { constructorService, Constructor } from "@/app/services/constructorService";
// import { architectService, Architect } from "@/app/services/architectService";
// import { technicianService, Technician } from "@/app/services/technicianService";
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { useTranslations } from '@/app/hooks/useTranslations';
// import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';

export default function SellerRequestsPage() {
  // const { t } = useTranslations();
  // type Role = "CONTRACTOR" | "ARCHITECT" | "TECHNICIAN";
  // type PendingUser = {
  //   id: string;
  //   role: Role;
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   phone: string;
  //   status: "APPROVED" | "REJECTED" | "PENDING" | string;
  //   createdAt: string;
  // };

  // const [requests, setRequests] = useState<PendingUser[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [actionLoading, setActionLoading] = useState<string | null>(null);
  // const [actionError, setActionError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const [pendingConstructors, pendingArchitects, pendingTechnicians] = await Promise.all([
  //         constructorService.getPendingContractors(),
  //         architectService.getPendingArchitects(),
  //         technicianService.getPendingTechnicians(),
  //       ]);

  //       const mappedConstructors: PendingUser[] = (pendingConstructors || []).map((c: Constructor) => ({
  //         id: c.id,
  //         role: "CONTRACTOR",
  //         firstName: c.firstName,
  //         lastName: c.lastName,
  //         email: c.email,
  //         phone: c.phone,
  //         status: c.status,
  //         createdAt: c.createdAt,
  //       }));

  //       const mappedArchitects: PendingUser[] = (pendingArchitects || []).map((a: Architect) => ({
  //         id: a.id,
  //         role: "ARCHITECT",
  //         firstName: a.firstName,
  //         lastName: a.lastName,
  //         email: a.email,
  //         phone: a.phone,
  //         status: a.status,
  //         createdAt: a.createdAt,
  //       }));

  //       const mappedTechnicians: PendingUser[] = (pendingTechnicians || []).map((tch: Technician) => ({
  //         id: tch.id,
  //         role: "TECHNICIAN",
  //         firstName: tch.firstName,
  //         lastName: tch.lastName,
  //         email: tch.email,
  //         phone: tch.phone,
  //         status: tch.status,
  //         createdAt: tch.createdAt,
  //       }));

  //       const combined = [...mappedConstructors, ...mappedArchitects, ...mappedTechnicians]
  //         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  //       setRequests(combined);
  //     } catch (err: any) {
  //       setError(t(dashboardFakes.sellerRequest.fetchError));
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchRequests();
  // }, [t]);

  return (
    <div>
      <h1>Requests</h1>
    </div>
    // <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
    //   <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{t(dashboardFakes.sellerRequest.title)}</h1>
    //   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 overflow-x-auto">
    //     {loading ? (
    //       <div className="text-center py-8 text-gray-500">{t(dashboardFakes.sellerRequest.loading)}</div>
    //     ) : error ? (
    //       <div className="text-center text-red-500 py-8">{error}</div>
    //     ) : requests.length === 0 ? (
    //       <div className="text-center text-gray-400 py-8">{t(dashboardFakes.sellerRequest.noRequestsFound)}</div>
    //     ) : (
    //       <Table className="min-w-[900px]">
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>{t(dashboardFakes.sellerRequest.tableName)}</TableHead>
    //             <TableHead>{t(dashboardFakes.sellerRequest.tableEmail)}</TableHead>
    //             <TableHead>{t(dashboardFakes.sellerRequest.tablePhone)}</TableHead>
    //             <TableHead>Role</TableHead>
    //             <TableHead>{t(dashboardFakes.sellerRequest.tableStatus)}</TableHead>
    //             <TableHead>{t(dashboardFakes.sellerRequest.tableSubmitted)}</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {requests.map((req) => (
    //             <TableRow key={`${req.role}-${req.id}`} className="hover:bg-blue-50 transition rounded-xl">
    //               <TableCell>{req.firstName} {req.lastName}</TableCell>
    //               <TableCell>{req.email}</TableCell>
    //               <TableCell>{req.phone}</TableCell>
    //               <TableCell>{req.role}</TableCell>
    //               <TableCell>
    //                 <Badge variant={req.status === "PENDING" ? "secondary" : req.status === "APPROVED" ? "default" : "destructive"}>
    //                   {req.status === "PENDING" ? t(dashboardFakes.sellerRequest.statusPending) : 
    //                    req.status === "APPROVED" ? t(dashboardFakes.sellerRequest.statusApproved) : 
    //                    t(dashboardFakes.sellerRequest.statusRejected)}
    //                 </Badge>
    //               </TableCell>
    //               <TableCell>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}</TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     )}
    //   </div>
    // </div>
  );
} 

