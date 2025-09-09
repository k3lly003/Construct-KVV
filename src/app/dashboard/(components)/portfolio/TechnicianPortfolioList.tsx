'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, EyeIcon, Loader2, MapPin, Users } from 'lucide-react';
import { Portfolio } from '@/app/services/porfolioService';
import { usePortfolio } from '@/app/hooks/usePortfolio';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUploaderGrid from './ImageUploaderGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  title?: string;
  description?: string;
}

export default function TechnicianPortfolioList({ title, description }: Props) {
  const { getMyPortfolios, update, toggleVisibility, loading } = usePortfolio();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editWorkDate, setEditWorkDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [viewOpen, setViewOpen] = useState(false);
  const [viewing, setViewing] = useState<Portfolio | null>(null);

  const headerTitle = useMemo(() => title ?? 'My Portfolio', [title]);
  const headerDesc = useMemo(
    () => description ?? "Your portfolio items (public and private).",
    [description]
  );

  useEffect(() => {
    getMyPortfolios().then(setItems).catch(() => setItems([]));
  }, [getMyPortfolios]);

  function openEditDialog(item: Portfolio) {
    setEditing(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditWorkDate(item.workDate);
    setEditCategory(item.category ?? '');
    setEditLocation(item.location ?? '');
    setEditBudget(item.budget ?? '');
    setEditDuration(item.duration ?? '');
    setEditSkills(item.skills?.join(', ') ?? '');
    setEditFiles([]);
    setEditPreviews(item.images ?? []);
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editing) return;
    // If new files selected, compress them and append to existing previews
    async function compressToDataUrl(file: File, maxBytes = 800_000, maxDimension = 1600, qualityStep = 0.85): Promise<string> {
      const img = document.createElement('img');
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
      await new Promise((resolve, reject) => {
        img.onload = resolve as any;
        img.onerror = reject as any;
        img.src = dataUrl;
      });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return dataUrl;
      let { width, height } = img as HTMLImageElement;
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img as HTMLImageElement, 0, 0, width, height);
      let quality = qualityStep;
      let out = canvas.toDataURL('image/jpeg', quality);
      while (out.length * 0.75 > maxBytes && quality > 0.4) {
        quality -= 0.1;
        out = canvas.toDataURL('image/jpeg', quality);
      }
      return out;
    }

    const compressed = await Promise.all(editFiles.map(f => compressToDataUrl(f)));
    const images = [...editPreviews, ...compressed];
    const updated = await update(editing.id, {
      title: editTitle,
      description: editDescription,
      workDate: editWorkDate,
      category: editCategory,
      location: editLocation,
      budget: editBudget,
      duration: editDuration,
      images,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setEditOpen(false);
    setEditing(null);
    if (updated) {
      setItems(prev => prev.map(it => it.id === updated.id ? { ...it, ...updated } : it));
    }
  }

  function openViewDialog(item: Portfolio) {
    setViewing(item);
    setViewOpen(true);
  }

  async function handleToggleVisibility(id: string) {
    const previous = items;
    setItems(prev => prev.map(it => it.id === id ? { ...it, isPublic: !it.isPublic } : it));
    setTogglingIds(prev => new Set(prev).add(id));
    try {
      const changed = await toggleVisibility(id);
      if (changed) {
        setItems(prev => prev.map(it => it.id === changed.id ? { ...it, ...changed } : it));
      }
    } catch {
      setItems(previous);
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No portfolio items published yet.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p) => (
            <Card key={p.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant={p.category?.toLowerCase() === 'commercial' ? 'default' : 'secondary'}>
                        {p.category || 'General'}
                      </Badge>
                      <Badge
                        variant={p.isPublic ? 'default' : 'outline'}
                        className={p.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}
                      >
                        {p.isPublic ? 'Visible' : 'Invisible'}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{p.title}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {p.skills?.[0]?.[0] ? p.skills[0][0].toUpperCase() : 'P'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{p.description}</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{p.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{p.workDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-green-600">{p.budget || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium text-green-600">{p.duration || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{(p.images?.length ?? 0)} Photos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 ${p.isPublic ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                      <span className={`text-sm px-2 py-0.5 rounded ${p.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                        {p.isPublic ? 'Visible' : 'Invisible'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2" onClick={() => openViewDialog(p)}>
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white flex items-center space-x-2" onClick={() => openEditDialog(p)}>
                      <span>Edit</span>
                    </Button>
                    <Button className="border border-amber-500 bg-transparent hover:bg-amber-600 hover:text-white text-amber-500 flex items-center space-x-2" onClick={() => handleToggleVisibility(p.id)} disabled={togglingIds.has(p.id)}>
                      {togglingIds.has(p.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span>Change Visibility</span>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Details Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-5xl w-[95vw]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{viewing?.title}</span>
                {viewing && (
                  <span className={`text-xs px-2 py-1 rounded ${viewing.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                    {viewing.isPublic ? 'Visible' : 'Invisible'}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            {viewing && (
              <div className="space-y-6">
                {viewing.images && viewing.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {viewing.images.map((src, idx) => (
                      <img key={idx} src={src} alt={`image-${idx}`} className="h-32 w-full object-cover rounded" />
                    ))}
                  </div>
                )}

                <p className="text-gray-700 whitespace-pre-line">{viewing.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Badge variant="secondary">Category</Badge>
                    <span>{viewing.category || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>{viewing.location || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span>{viewing.workDate || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <DollarSign className="h-4 w-4" />
                    <span>{viewing.budget || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span>{viewing.duration || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Users className="h-4 w-4" />
                    <span>{(viewing.images?.length ?? 0)} Photos</span>
                  </div>
                </div>

                {viewing.skills && viewing.skills.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {viewing.skills.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Portfolio</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Work Date</label>
                <Input type="date" value={editWorkDate} onChange={e => setEditWorkDate(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type of work" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Renovation">Renovation</SelectItem>
                    <SelectItem value="New Construction">New Construction</SelectItem>
                    <SelectItem value="Interior Design">Interior Design</SelectItem>
                    <SelectItem value="Landscape">Landscape</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input value={editLocation} onChange={e => setEditLocation(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Budget</label>
                <Input value={editBudget} onChange={e => setEditBudget(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <Input value={editDuration} onChange={e => setEditDuration(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Images</label>
                <ImageUploaderGrid files={editFiles} previews={editPreviews} onChange={(f, p) => { setEditFiles(f); setEditPreviews(p); }} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Skills (comma separated)</label>
                <Input value={editSkills} onChange={e => setEditSkills(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={saveEdit} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}


