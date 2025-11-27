"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ApprovedArchitects from "@/app/(components)/professionals/ApprovedArchtects";
import ApprovedConstructors from "@/app/(components)/professionals/ApprovedConstructors";
import ApprovedTechnicians from "@/app/(components)/professionals/ApprovedTechnicians";
import ApprovedSellers from "@/app/(components)/professionals/ApprovedSellers";
import Image from "next/image";

export default function ProfessionalsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Get role from URL query parameter, default to 'ALL'
  const roleFromUrl = searchParams.get('role')?.toUpperCase();
  const validRoles = ['ALL', 'ARCHITECT', 'CONTRACTOR', 'SELLER', 'TECHNICIAN'];
  const initialRole = roleFromUrl && validRoles.includes(roleFromUrl) 
    ? (roleFromUrl as 'ALL' | 'ARCHITECT' | 'CONTRACTOR' | 'SELLER' | 'TECHNICIAN')
    : 'ALL';
  
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ARCHITECT' | 'CONTRACTOR' | 'SELLER' | 'TECHNICIAN'>(initialRole);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Approved Professionals</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Browse architects, contractors, technicians, and sellers</p>
          </div>

          <div className="">
            <div className="flex items-center gap-3 mx-5">
              <input
                type="text"
                placeholder="Search by name or title"
                className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All</option>
                <option value="ARCHITECT">Architect</option>
                <option value="CONTRACTOR">Contractor</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="SELLER">Seller</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {roleFilter === 'ALL' ? (
                <>
                  <ApprovedArchitects searchQuery={searchQuery} />
                  <ApprovedConstructors searchQuery={searchQuery} />
                  <ApprovedTechnicians searchQuery={searchQuery} />
                  <ApprovedSellers searchQuery={searchQuery} />
                </>
              ) : roleFilter === 'ARCHITECT' ? (
                <ApprovedArchitects searchQuery={searchQuery} />
              ) : roleFilter === 'CONTRACTOR' ? (
                <ApprovedConstructors searchQuery={searchQuery} />
              ) : roleFilter === 'TECHNICIAN' ? (
                <ApprovedTechnicians searchQuery={searchQuery} />
              ) : roleFilter === 'SELLER' ? (
                <ApprovedSellers searchQuery={searchQuery} />
              ) : (
                <ApprovedTechnicians searchQuery={searchQuery} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
