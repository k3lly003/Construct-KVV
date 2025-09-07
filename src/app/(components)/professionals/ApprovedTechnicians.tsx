"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { technicianService, Technician } from "@/app/services/technicianService";

export default function ApprovedTechnicians({ searchQuery = "" }: { searchQuery?: string }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await technicianService.getApprovedTechnicians().catch(() => []);
        const list: Technician[] = Array.isArray(res) ? (res as Technician[]) : ((res as any)?.data ?? []);
        const normalized = list.map((t) => ({
          id: `technician-${t.id}`,
          title: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || 'Technician',
          provider: { name: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || 'Technician' },
          gallery: t.user?.profilePic ? [t.user.profilePic] : [],
          location: { city: t.location?.[0] || '' },
          features: [
            'Role: Technician',
            ...(Array.isArray(t.categories) ? t.categories.slice(0, 3) : []),
            `Experience: ${t.experience || 0}y`,
          ],
        }));
        console.log('[ApprovedTechnicians] fetched:', list.length, 'normalized:', normalized.length);
        setItems(normalized);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = items.filter((it) => (
    (it.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (it.provider?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ));
  console.log('[ApprovedTechnicians] rendering count:', filtered.length, 'searchQuery:', searchQuery);

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
      ) : filtered.length === 0 ? (
        <div className="col-span-full flex justify-center items-center py-12 text-gray-500">No technicians found.</div>
      ) : (
        filtered.map((prof) => (
          <Link key={prof.id} href={`/professionals/technician/${prof.id}`} className="block">
            <div className="overflow-hidden hover:shadow-lg cursor-pointer hover:rounded-xl">
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
                    <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">Technician</span>
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
          </Link>
        ))
      )}
    </>
  );
}




