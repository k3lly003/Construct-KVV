"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllSellers, SellerProfile } from "@/app/services/sellerService";

export default function ApprovedSellers({ searchQuery = "" }: { searchQuery?: string }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        if (!authToken) {
          console.warn("No auth token found for sellers");
          setItems([]);
          return;
        }
        
        console.log("Fetching all sellers...");
        const res = await getAllSellers(authToken).catch((error) => {
          console.error("Error fetching all sellers:", error);
          return [];
        });
        
        console.log("All sellers response:", res);
        const allSellers: SellerProfile[] = Array.isArray(res) ? (res as SellerProfile[]) : ((res as any)?.data ?? []);
        console.log("All sellers list:", allSellers);
        
        // Filter for approved sellers only
        const approvedSellers = allSellers.filter(seller => 
          seller.status === 'APPROVED'
        );
        console.log("Approved sellers after filtering:", approvedSellers);
        
        const normalized = approvedSellers.map((s) => ({
          id: `seller-${s._id}`,
          title: s.businessName || `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim() || 'Seller',
          provider: { name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim() || 'Seller' },
          gallery: (s as any).user?.profilePic ? [(s as any).user.profilePic] : [],
          location: { city: s.businessAddress || '' },
          features: [
            'Role: Seller',
            ...(s.taxId ? ["Tax ID: " + s.taxId] : []),
            `Phone: ${s.businessPhone || 'N/A'}`,
          ],
        }));
        
        console.log("Normalized sellers for display:", normalized);
        setItems(normalized);
        setError(null);
      } catch (error) {
        console.error("Error in load function:", error);
        setError("Failed to load sellers. Please try again.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const retryLoad = () => {
    setError(null);
    setLoading(true);
    // The useEffect will trigger again when loading state changes
    window.location.reload();
  };

  const filtered = items.filter((it) => (
    (it.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (it.provider?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <>
      {loading ? (
        <>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse overflow-hidden rounded-xl">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </>
      ) : error ? (
        <div className="col-span-full flex flex-col justify-center items-center py-12 text-gray-500">
          <p className="mb-4">{error}</p>
          <button 
            onClick={retryLoad} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="col-span-full flex justify-center items-center py-12 text-gray-500">No sellers found.</div>
      ) : (
        filtered.map((prof) => (
          <div key={prof.id} className="overflow-hidden hover:shadow-lg cursor-pointer hover:rounded-xl">
            <section className="p-0">
              <div className="pb-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={prof.gallery && prof.gallery.length > 0 ? prof.gallery[0] : '/empty-cart.png'}
                    width={100}
                    height={100}
                    alt={prof.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">Seller</span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{prof.location?.city || '-'}</span>
                </div>
                <h1 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2">{prof.title}</h1>
                <p className="text-sm text-gray-600 mb-3">{prof.provider?.name || '-'}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {(prof.features || []).filter((f: string) => !f.startsWith('Role:')).slice(0, 4).map((feature: string) => (
                    <span key={feature} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ))
      )}
    </>
  );
}
