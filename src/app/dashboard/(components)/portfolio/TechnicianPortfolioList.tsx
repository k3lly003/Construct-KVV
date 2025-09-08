'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Portfolio } from '@/app/services/porfolioService';
import { usePortfolio } from '@/app/hooks/usePortfolio';
import { useUserStore } from '@/store/userStore';

export default function TechnicianPortfolioList() {
  const { getPublicByProfessional, loading } = usePortfolio();
  const { id } = useUserStore();
  const [items, setItems] = useState<Portfolio[]>([]);

  useEffect(() => {
    if (!id) return;
    getPublicByProfessional('technician', id).then(setItems).catch(() => setItems([]));
  }, [getPublicByProfessional, id]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Public Portfolio</CardTitle>
        <CardDescription>Technician portfolio items visible to others.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">No portfolio items published yet.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(p => (
            <div key={p.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${p.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.isPublic ? 'Public' : 'Private'}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{p.description}</p>
              <div className="text-xs text-gray-500 mt-2">{p.location} • {p.workDate}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


