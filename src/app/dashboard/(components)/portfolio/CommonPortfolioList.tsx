'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Portfolio, ProfessionalType } from '@/app/services/porfolioService';
import { usePortfolio } from '@/app/hooks/usePortfolio';
import { useUserStore } from '@/store/userStore';

interface Props {
  professionalType: ProfessionalType;
  title?: string;
  description?: string;
}

export default function CommonPortfolioList({ professionalType, title, description }: Props) {
  const { getPublicByProfessional, toggleVisibility, update, remove, loading } = usePortfolio();
  const { id: userId } = useUserStore();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const headerTitle = useMemo(() => title ?? 'My Public Portfolio', [title]);
  const headerDesc = useMemo(
    () => description ?? 'Portfolio items visible to others.',
    [description]
  );

  async function refresh() {
    if (!userId) return;
    const data = await getPublicByProfessional(professionalType, userId);
    setItems(data);
  }

  useEffect(() => {
    refresh().catch(() => setItems([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalType, userId]);

  function beginEdit(item: Portfolio) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  }

  async function saveEdit() {
    if (!editingId) return;
    await update(editingId, { title: editTitle, description: editDescription });
    setEditingId(null);
    await refresh();
  }

  async function handleToggle(id: string) {
    await toggleVisibility(id);
    await refresh();
  }

  async function handleDelete(id: string) {
    await remove(id);
    await refresh();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Working...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">No public items yet.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(p => (
            <div key={p.id} className="border rounded-lg p-4 space-y-2">
              {editingId === p.id ? (
                <div className="space-y-2">
                  <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                  <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} disabled={loading}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${p.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt={p.title} className="mt-1 h-32 w-full object-cover rounded" />
                  )}
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{p.description}</p>
                  <div className="text-xs text-gray-500">{p.location} • {p.workDate}</div>
                  <div className="flex gap-2 pt-2 items-center">
                    <Button size="sm" variant="secondary" onClick={() => beginEdit(p)}>Edit</Button>
                    <Button size="sm" onClick={() => handleToggle(p.id)}>Toggle Visibility</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


