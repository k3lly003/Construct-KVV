'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePortfolio } from '@/app/hooks/usePortfolio';
import ImageUploaderGrid from './ImageUploaderGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  onSuccess?: () => void;
}

export default function CreatePortfolioDialog({ onSuccess }: Props) {
  const { create, loading, error } = usePortfolio();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [skills, setSkills] = useState('');
  const [clientFeedback, setClientFeedback] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

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

    let { width, height } = img;
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    let quality = qualityStep;
    let out = canvas.toDataURL('image/jpeg', quality);
    while (out.length * 0.75 > maxBytes && quality > 0.4) {
      quality -= 0.1;
      out = canvas.toDataURL('image/jpeg', quality);
    }
    return out;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    // guard: limit number/size to avoid 413
    const MAX_FILES = 8;
    const MAX_FILE_BYTES = 2_000_000; // 2MB source before compression
    if (files.length > MAX_FILES) {
      setLocalError(`Please select up to ${MAX_FILES} images.`);
      return;
    }
    if (files.some(f => f.size > MAX_FILE_BYTES)) {
      setLocalError('Each image must be <= 2MB.');
      return;
    }

    // compress to reasonable size/base64
    const base64Images = await Promise.all(files.map(f => compressToDataUrl(f)));

    await create({
      title,
      description,
      workDate,
      images: base64Images,
      category,
      location,
      budget,
      duration,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      clientFeedback: clientFeedback || undefined,
      isPublic,
    });
    setOpen(false);
    setTitle('');
    setDescription('');
    setWorkDate('');
    setFiles([]);
    setPreviews([]);
    setCategory('');
    setLocation('');
    setBudget('');
    setDuration('');
    setSkills('');
    setClientFeedback('');
    setIsPublic(true);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Portfolio</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Portfolio Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Work Date</label>
            <Input type="date" value={workDate} onChange={e => setWorkDate(e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
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
            <Input value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Budget</label>
            <Input value={budget} onChange={e => setBudget(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Duration</label>
            <Input value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Images</label>
            <ImageUploaderGrid files={files} previews={previews} onChange={(f, p) => { setFiles(f); setPreviews(p); }} />
          </div>
          <div>
            <label className="text-sm font-medium">Skills (comma separated)</label>
            <Input value={skills} onChange={e => setSkills(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Client Feedback</label>
            <Textarea value={clientFeedback} onChange={e => setClientFeedback(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            <label htmlFor="isPublic" className="text-sm">Public</label>
          </div>
          <DialogFooter className="md:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Portfolio'}</Button>
            {(error || localError) && <span className="text-red-600 text-sm ml-2">{localError ?? error}</span>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


