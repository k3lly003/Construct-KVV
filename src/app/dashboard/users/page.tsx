"use client";

import { useEffect, useState, useCallback } from "react";
import { UsersService } from "@/app/services/usersService";
import { User } from "@/types/user";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { useTranslations } from '@/app/hooks/useTranslations';

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { t } = useTranslations();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get auth token from localStorage
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      
      if (!authToken) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

             // Fetch users with search and role filters
       const result = await UsersService.getAllUsers(
         authToken, // Pass the auth token
         page,
         PAGE_SIZE,
         debouncedSearch, // Use debounced search instead of immediate search
         roleFilter,
         undefined // isActive - no status filter
       );
      console.log("API Response:", result);
      
      setUsers(result.users || []);
      if (result.meta) {
        setTotalPages(result.meta.totalPages || 1);
        setTotalUsers(result.meta.total || 0);
      }
    } catch (err: any) {
      setError(t('dashboard.users.fetchError'));
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
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

  // Fetch users when debounced search, role filter, or page changes
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, roleFilter]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleSetStatus = async (user: User, isActive: boolean) => {
    setActionLoading(user.id);
    try {
      // Note: You'll need to implement updateUserStatus in usersService
      // await UsersService.updateUserStatus(user.id, isActive, authToken);
      // For now, just update the local state
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive } : u)));
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setActionLoading(null);
    }
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{t('dashboard.users.title')}</h1>
      <div className="mb-6 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
        <input
          placeholder={t('dashboard.users.searchPlaceholder')}
          className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition w-full md:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select
          className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={roleFilter}
          onChange={(e) => handleRoleFilterChange(e.target.value)}
        >
          <option value="">{t('dashboard.users.allRoles')}</option>
          <option value="ARCHITECT">ARCHITECT</option>
          <option value="TECHNICIAN">TECHNICIAN</option>
          <option value="CONTRACTOR">CONTRACTOR</option>
          <option value="CLIENT">CLIENT</option>
          <option value="SUPPLIER">SUPPLIER</option>
        </select>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('dashboard.users.loading')}</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 py-8">{t('dashboard.users.noUsersFound')}</div>
        ) : (
          <>
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-2">{t('dashboard.users.tableUser')}</TableHead>
                  <TableHead>{t('dashboard.users.tableEmail')}</TableHead>
                  <TableHead>{t('dashboard.users.tablePhone')}</TableHead>
                  <TableHead>{t('dashboard.users.tableRole')}</TableHead>
                  <TableHead>{t('dashboard.users.tableStatus')}</TableHead>
                  <TableHead>{t('dashboard.users.tableCreated')}</TableHead>
                  <TableHead className="text-center">{t('dashboard.users.tableActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition rounded-xl">
                    <TableCell className="flex items-center gap-3 py-3 pl-2">
                      <Avatar>
                        <AvatarFallback>{getInitials(`${user.firstName || ""} ${user.lastName || ""}`)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-800 dark:text-white">{user.firstName} {user.lastName}</span>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{user.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"}`}>
                        {user.isActive ? t('dashboard.users.statusActive') : t('dashboard.users.statusSuspended')}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleViewDetails(user)} className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-semibold shadow-sm">
                          {t('dashboard.users.viewDetails')}
                        </button>
                        <button 
                          disabled={actionLoading === user.id} 
                          onClick={() => handleSetStatus(user, true)} 
                          className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-xs font-semibold shadow-sm disabled:opacity-50"
                        >
                          Activate
                        </button>
                        <button 
                          disabled={actionLoading === user.id} 
                          onClick={() => handleSetStatus(user, false)} 
                          className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-xs font-semibold shadow-sm disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-gray-500 dark:text-gray-400 text-sm">
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
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">{selectedUser.firstName} {selectedUser.lastName}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{selectedUser.email}</div>
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
    </div>
  );
} 