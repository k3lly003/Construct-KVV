"use client";

import { useEffect, useState } from "react";
import { UsersService } from "@/app/services/usersServices";
import { User } from "@/types/user";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { useTranslations } from '@/app/hooks/useTranslations';

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { t } = useTranslations();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = getUserDataFromLocalStorage();
      const token = userData?.token;
      // Only use API for pagination
      const { users, meta } = await UsersService.getAllUsers(token, page, PAGE_SIZE);
      setUsers(users || []);
      setTotalPages(meta?.totalPages || 1);
      setTotalUsers(meta?.total || 0);
    } catch (err: any) {
      setError(t('dashboard.users.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // Client-side search, role, and status filter
  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (user.firstName?.toLowerCase().includes(term) || false) ||
      (user.lastName?.toLowerCase().includes(term) || false) ||
      (user.email?.toLowerCase().includes(term) || false) ||
      (user.phone?.toLowerCase().includes(term) || false);
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter
      ? statusFilter === "active"
        ? user.isActive
        : !user.isActive
      : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page]);

  const handleStatusChange = async (user: User, newStatus: boolean) => {
    setActionLoading(user.id);
    try {
      const userData = getUserDataFromLocalStorage();
      const token = userData?.token;
      if (!token) throw new Error("No auth token");
      await UsersService.updateUserStatus(user.id, newStatus, token);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: newStatus } : u));
    } catch (err) {
      // Optionally show error toast
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('dashboard.users.title')}</h1>
      <div className="mb-6 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
        <input
          placeholder={t('dashboard.users.searchPlaceholder')}
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition w-full md:w-64"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">{t('dashboard.users.allRoles')}</option>
          <option value="CUSTOMER">{t('dashboard.users.roleCustomer')}</option>
          <option value="SELLER">{t('dashboard.users.roleSeller')}</option>
          <option value="ADMIN">{t('dashboard.users.roleAdmin')}</option>
        </select>
        <select
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">{t('dashboard.users.allStatus')}</option>
          <option value="active">{t('dashboard.users.statusActive')}</option>
          <option value="suspended">{t('dashboard.users.statusSuspended')}</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">{t('dashboard.users.loading')}</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">{t('dashboard.users.noUsersFound')}</div>
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
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-blue-50 transition rounded-xl">
                    <TableCell className="flex items-center gap-3 py-3 pl-2">
                      <Avatar>
                        {user.profilePic ? (
                          <AvatarImage src={user.profilePic} alt={user.firstName || user.email} />
                        ) : (
                          <AvatarFallback>{getInitials(`${user.firstName || ""} ${user.lastName || ""}`)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium text-gray-800">{user.firstName} {user.lastName}</span>
                    </TableCell>
                    <TableCell className="text-gray-700">{user.email}</TableCell>
                    <TableCell className="text-gray-700">{user.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : user.role === "SELLER" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {t(`dashboard.users.role${user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : ''}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {user.isActive ? t('dashboard.users.statusActive') : t('dashboard.users.statusSuspended')}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-semibold shadow-sm flex items-center gap-1">
                            {t('dashboard.users.actions')}
                            {actionLoading === user.id && <span className="ml-2 animate-spin">⏳</span>}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                            {t('dashboard.users.viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.isActive ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(user, false)} disabled={actionLoading === user.id}>
                              {t('dashboard.users.deactivate')}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(user, true)} disabled={actionLoading === user.id}>
                              {t('dashboard.users.activate')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-gray-500 text-sm">
                {t('dashboard.users.showingPage', { page, totalPages, count: filteredUsers.length })}
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t('dashboard.users.previous')}
                </button>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
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
                  {selectedUser.profilePic ? (
                    <AvatarImage src={selectedUser.profilePic} alt={selectedUser.firstName || selectedUser.email} />
                  ) : (
                    <AvatarFallback>{getInitials(`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">{selectedUser.firstName} {selectedUser.lastName}</div>
                  <div className="text-gray-500 text-sm">{selectedUser.email}</div>
                </div>
              </div>
              <div><span className="font-medium">{t('dashboard.users.phone')}:</span> {selectedUser.phone}</div>
              <div><span className="font-medium">{t('dashboard.users.role')}:</span> {t(`dashboard.users.role${selectedUser.role ? selectedUser.role.charAt(0) + selectedUser.role.slice(1).toLowerCase() : ''}`)}</div>
              <div><span className="font-medium">{t('dashboard.users.status')}:</span> {selectedUser.isActive ? t('dashboard.users.statusActive') : t('dashboard.users.statusSuspended')}</div>
              <div><span className="font-medium">{t('dashboard.users.created')}:</span> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : ""}</div>
            </div>
          ) : null}
          <DialogClose asChild>
            <button className="mt-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">{t('dashboard.users.close')}</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
} 