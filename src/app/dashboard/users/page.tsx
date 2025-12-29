"use client";

import { useEffect, useState } from "react";
import { UsersService } from "@/app/services/usersService";
import { User } from "@/types/user";
import { constructorService } from "@/app/services/constructorService";
import { technicianService } from "@/app/services/technicianService";
import { architectService } from "@/app/services/architectService";
import { getAllSellers, getApprovedSellers, getPendingSellers, updateSellerStatus, SellerStatusUpdate } from "@/app/services/sellerService";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { useTranslations } from '@/app/hooks/useTranslations';
import { EllipsisVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { t } = useTranslations();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionUser, setActionUser] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("CONTRACTOR");

  const fetchContractors = async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      let response: any;

      // Use the appropriate constructor service based on status
      if (status === "APPROVED") {
        response = await constructorService.getApprovedContractors();
      } else if (status === "PENDING") {
        response = await constructorService.getPendingContractors();
      } else {
        // Default: show all contractors
        response = await constructorService.getAllContractors();
      }

      console.log('API Response:', response);

      // Handle different response formats
      let result: any[] = [];
      if (Array.isArray(response)) {
        // Direct array response
        result = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response with data property
        result = response.data;
      } else if (response && response.success && Array.isArray(response.data)) {
        // Response with success and data properties
        result = response.data;
      } else {
        console.error('Unexpected response format:', response);
        setError('Unexpected response format from server');
        return;
      }

      // Transform the data to a consistent format
      const transformedUsers = result.map((contractor: any) => ({
        id: contractor._id || contractor.id,
        firstName: contractor.firstName || contractor.user?.firstName || "",
        lastName: contractor.lastName || contractor.user?.lastName || "",
        email: contractor.email || contractor.user?.email || "",
        phone: contractor.phone || contractor.user?.phone || "",
        role: "CONTRACTOR",
        isActive: contractor.status === "APPROVED" || contractor.isActive || false,
        createdAt: contractor.createdAt || contractor.user?.createdAt,
        businessName: contractor.businessName || "",
        status: contractor.status || (contractor.isActive ? "APPROVED" : "PENDING"),
        // Additional contractor-specific fields
        yearsExperience: contractor.yearsExperience || 0,
        licenseNumber: contractor.licenseNumber || "",
        location: contractor.location || []
      }));

      console.log('Transformed users:', transformedUsers);
      setUsers(transformedUsers);
      setTotalUsers(transformedUsers.length);
      setTotalPages(1);
      
    } catch (err: any) {
      console.error('Error fetching contractors:', err);
      setError('Failed to fetch contractors: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = async (role: string, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Get auth token from localStorage
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      
      if (!authToken) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      let result: any[] = [];

      switch (role) {
        case "CONTRACTOR":
          if (status === "APPROVED") {
            result = await constructorService.getApprovedContractors();
          } else if (status === "PENDING") {
            result = await constructorService.getPendingContractors();
          } else {
            result = await constructorService.getAllContractors();
          }
          break;
        
        case "TECHNICIAN":
          if (status === "APPROVED") {
            result = await technicianService.getApprovedTechnicians();
          } else if (status === "PENDING") {
            result = await technicianService.getPendingTechnicians();
          } else {
            result = await technicianService.getAllTechnicians();
          }
          break;
        
        case "ARCHITECT":
          if (status === "APPROVED") {
            result = await architectService.getApprovedArchitects();
          } else if (status === "PENDING") {
            result = await architectService.getPendingArchitects();
          } else {
            result = await architectService.getAllArchitects();
          }
          break;
        
        case "SELLER":
          if (status === "APPROVED") {
            result = await getApprovedSellers(authToken);
          } else if (status === "PENDING") {
            result = await getPendingSellers(authToken);
          } else {
            result = await getAllSellers(authToken);
          }
          break;
        
        default:
          // Fallback to general users API
          const generalResult = await UsersService.getAllUsers(
            authToken,
            page,
            PAGE_SIZE,
            debouncedSearch,
            roleFilter,
            undefined
          );
          result = generalResult.users || [];
          if (generalResult.meta) {
            setTotalPages(generalResult.meta.totalPages || 1);
            setTotalUsers(generalResult.meta.total || 0);
          }
      }

      // Transform the data to a consistent format
      const transformedUsers = result.map((user: any) => ({
        id: user._id || user.id,
        firstName: user.firstName || user.user?.firstName || "",
        lastName: user.lastName || user.user?.lastName || "",
        email: user.email || user.user?.email || "",
        phone: user.phone || user.user?.phone || "",
        role: role,
        isActive: user.status === "APPROVED" || user.isActive || false,
        createdAt: user.createdAt || user.user?.createdAt,
        businessName: user.businessName || "",
        status: user.status || (user.isActive ? "APPROVED" : "PENDING"),
        // Additional role-specific fields
        yearsExperience: user.yearsExperience || 0,
        licenseNumber: user.licenseNumber || "",
        location: user.location || []
      }));

      setUsers(transformedUsers);
      setTotalUsers(transformedUsers.length);
      setTotalPages(1);
      
    } catch (err: any) {
      setError(t('dashboard.users.fetchError'));
      console.error('Error fetching users by role:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (currentRole) {
      await fetchUsersByRole(currentRole, statusFilter);
    } else {
      // Fallback to contractors
      await fetchContractors(statusFilter);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [search]);

  // Initial load - fetch all contractors by default
  useEffect(() => {
    fetchContractors(); // This will call getAllContractors by default
  }, []);

  // Fetch users when debounced search, role filter, or page changes
  useEffect(() => {
    if (currentRole) {
      fetchUsers();
    }
  }, [page, debouncedSearch, roleFilter, currentRole, statusFilter]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleSetStatus = async (user: any, newStatus: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    setActionLoading(user.id);
    try {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      
      if (!authToken) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      // Update status based on current role
      switch (currentRole) {
        case "CONTRACTOR":
          await constructorService.updateContractorStatus(user.id, { status: newStatus });
          break;
        case "TECHNICIAN":
          await technicianService.updateTechnicianStatus(user.id, { status: newStatus });
          break;
        case "ARCHITECT":
          await architectService.updateArchitectStatus(user.id, { status: newStatus });
          break;
        case "SELLER":
          await updateSellerStatus(user.id, { status: newStatus }, authToken);
          break;
        default:
          throw new Error('Unknown role for status update');
      }

      // Update local state
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus, isActive: newStatus === 'APPROVED' } : u)));
      setShowActionDialog(false);
      setActionUser(null);
      
      // Show success message
      const statusText = newStatus === 'APPROVED' ? 'approved' : newStatus === 'REJECTED' ? 'rejected' : 'pending';
      console.log(`Successfully ${statusText} ${currentRole.toLowerCase()}`);
      
    } catch (error) {
      console.error('Error updating user status:', error);
      setError(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    setActionLoading(user.id);
    try {
      // Note: You'll need to implement deleteUser in usersService
      // await UsersService.deleteUser(user.id, authToken);
      // For now, just remove from local state
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const openActionDialog = (user: User) => {
    setActionUser(user);
    setShowActionDialog(true);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    // Don't reset page here, let the debounced effect handle it
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1); // Reset to first page when filtering
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-title font-bold mb-6 text-gray-800 dark:text-white">
        {currentRole ? `${currentRole.charAt(0) + currentRole.slice(1).toLowerCase()} Management` : 'User Management'}
      </h1>
      <div className="mb-6 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
        <input
          type="text"
          placeholder={`Search ${currentRole ? currentRole.toLowerCase() + 's' : 'users'}...`}
          className="w-full md:w-1/2 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select
          className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            if (currentRole) {
              fetchUsersByRole(currentRole, e.target.value);
            }
          }}
        >
          <option value="">All {currentRole || 'Users'}</option>
          <option value="APPROVED">Approved {currentRole || 'Users'}</option>
          <option value="PENDING">Pending {currentRole || 'Users'}</option>
        </select>
      </div>
      {/* Role Filter Buttons */}
      <div className="mb-6 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
        <Button 
          onClick={() => {
            setCurrentRole("CONTRACTOR");
            setStatusFilter("");
            fetchUsersByRole("CONTRACTOR");
          }}
          variant={currentRole === "CONTRACTOR" ? "default" : "outline"}
        >
          All Contractors
        </Button>
        <Button 
          onClick={() => {
            setCurrentRole("ARCHITECT");
            setStatusFilter("");
            fetchUsersByRole("ARCHITECT");
          }}
          variant={currentRole === "ARCHITECT" ? "default" : "outline"}
        >
          All Architects
        </Button>
        <Button 
          onClick={() => {
            setCurrentRole("TECHNICIAN");
            setStatusFilter("");
            fetchUsersByRole("TECHNICIAN");
          }}
          variant={currentRole === "TECHNICIAN" ? "default" : "outline"}
        >
          All Technicians
        </Button>
        <Button 
          onClick={() => {
            setCurrentRole("SELLER");
            setStatusFilter("");
            fetchUsersByRole("SELLER");
          }}
          variant={currentRole === "SELLER" ? "default" : "outline"}
        >
          All Sellers
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('dashboard.users.loading')}</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <div className="font-semibold mb-2">Error Loading Contractors</div>
            <div className="text-small">{error}</div>
            <button 
              onClick={() => fetchContractors(statusFilter)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 py-8">{t('dashboard.users.noUsersFound')}</div>
        ) : (
          <>
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-2">{currentRole || 'User'}</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition rounded-xl">
                    <TableCell className="flex items-center gap-3 py-3 pl-2">
                      <Avatar>
                        <AvatarFallback>{getInitials(`${user.firstName || ""} ${user.lastName || ""}`)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-gray-800 dark:text-white">{user.firstName} {user.lastName}</span>
                        {user.businessName && (
                          <div className="text-small text-gray-500 dark:text-gray-400">{user.businessName}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{user.phone}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      <div className="font-medium">{user.businessName}</div>
                      {user.licenseNumber && (
                        <div className="text-small text-gray-500">License: {user.licenseNumber}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {user.yearsExperience} years
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-small font-semibold ${
                        user.status === "APPROVED" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" :
                        user.status === "PENDING" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" :
                        user.status === "REJECTED" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" :
                        user.isActive ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      }`}>
                        {user.status || (user.isActive ? "ACTIVE" : "INACTIVE")}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleViewDetails(user)} className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-small font-semibold shadow-sm">
                          {t('dashboard.users.viewDetails')}
                        </button>
                        <button 
                          disabled={actionLoading === user.id}
                          onClick={() => openActionDialog(user)}
                          className="px-3 py-1 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition text-small font-semibold shadow-sm disabled:opacity-50"
                        >
                          Update Status
                        </button>
                        <button 
                          disabled={actionLoading === user.id}
                          onClick={() => handleDeleteUser(user)}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-small font-semibold shadow-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openActionDialog(user)}>
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-gray-500 dark:text-gray-400 text-small">
                {t('dashboard.users.showingPage', { page, totalPages, count: users.length })}
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 text-gray-800 dark:text-white"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t('dashboard.users.previous')}
                </button>
                <button
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 text-gray-800 dark:text-white"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  {t('dashboard.users.next')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.users.detailsTitle')}</DialogTitle>
          </DialogHeader>
          {selectedUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-mid text-gray-900 dark:text-white">{selectedUser.firstName} {selectedUser.lastName}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-small">{selectedUser.email}</div>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('dashboard.users.phone')}:</span> {selectedUser.phone}</div>
              <div className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('dashboard.users.role')}:</span> {selectedUser.role}</div>
              <div className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('dashboard.users.status')}:</span> {selectedUser.isActive ? t('dashboard.users.statusActive') : t('dashboard.users.statusSuspended')}</div>
              <div className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('dashboard.users.created')}:</span> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : ""}</div>
            </div>
          ) : null}
          <DialogClose asChild>
            <button className="mt-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition text-gray-800 dark:text-white">{t('dashboard.users.close')}</button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Action Dialog for Status Update */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Update {currentRole} Status
            </DialogTitle>
          </DialogHeader>
          {actionUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(`${actionUser.firstName || ""} ${actionUser.lastName || ""}`)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-mid text-gray-900 dark:text-white">{actionUser.firstName} {actionUser.lastName}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-small">{actionUser.email}</div>
                  <div className="text-small text-gray-600 dark:text-gray-400">Current Status: {actionUser.status}</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Select the new status for this {currentRole.toLowerCase()}:
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowActionDialog(false);
                    setActionUser(null);
                  }}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSetStatus(actionUser, 'APPROVED')}
                  disabled={actionLoading === actionUser.id || actionUser.status === 'APPROVED'}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading === actionUser.id ? 'Processing...' : 'Approve'}
                </Button>
                <Button
                  onClick={() => handleSetStatus(actionUser, 'REJECTED')}
                  disabled={actionLoading === actionUser.id || actionUser.status === 'REJECTED'}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === actionUser.id ? 'Processing...' : 'Reject'}
                </Button>
                <Button
                  onClick={() => handleSetStatus(actionUser, 'PENDING')}
                  disabled={actionLoading === actionUser.id || actionUser.status === 'PENDING'}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                >
                  {actionLoading === actionUser.id ? 'Processing...' : 'Set Pending'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 