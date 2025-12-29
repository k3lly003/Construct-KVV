'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  async function compressToDataUrl(file: File, maxBytes = 120_000, maxDimension = 1000, qualityStep = 0.6): Promise<string> {
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
    while (out.length * 0.75 > maxBytes && quality > 0.35) {
      quality -= 0.1;
      out = canvas.toDataURL('image/jpeg', quality);
    }
    return out;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    // guard: limit number/size to avoid 413
    const MAX_FILES = 3;
    const MAX_FILE_BYTES = 1_000_000; // 1MB source before compression
    if (files.length > MAX_FILES) {
      setLocalError(`Please select up to ${MAX_FILES} images.`);
      return;
    }
    if (files.some(f => f.size > MAX_FILE_BYTES)) {
      setLocalError('Each image must be <= 1MB.');
      return;
    }

    // compress to reasonable size/base64
    const base64Images = await Promise.all(files.map(f => compressToDataUrl(f)));
    
    // Additional check: ensure total payload size is reasonable
    const totalBytes = base64Images.reduce((sum, img) => sum + Math.floor(img.length * 0.75), 0);
    const MAX_TOTAL_BYTES = 350_000; // ~350KB total for all images
    let finalImages = base64Images;
    if (totalBytes > MAX_TOTAL_BYTES) {
      // Try to trim images to fit within limit
      const trimmed: string[] = [];
      let running = 0;
      for (const img of base64Images) {
        const bytes = Math.floor(img.length * 0.75);
        if (running + bytes > MAX_TOTAL_BYTES) break;
        trimmed.push(img);
        running += bytes;
      }
      if (trimmed.length === 0) {
        setLocalError('Images are too large. Please choose smaller images.');
        return;
      }
      finalImages = trimmed;
    }

    const created = await create({
      title,
      description,
      workDate,
      images: finalImages,
      category,
      location,
      budget,
      duration,
      skills: skills ? [skills] : [],
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
    router.refresh();
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
            <label className="text-small font-medium">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-small font-medium">Work Date</label>
            <Input type="date" value={workDate} onChange={e => setWorkDate(e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="text-small font-medium">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="text-small font-medium">Category</label>
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
            <label className="text-small font-medium">Location</label>
            <Input value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="text-small font-medium">Budget</label>
            <Input value={budget} onChange={e => setBudget(e.target.value)} />
          </div>
          <div>
            <label className="text-small font-medium">Duration</label>
            <Input value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-small font-medium">Images</label>
            <ImageUploaderGrid files={files} previews={previews} onChange={(f, p) => { setFiles(f); setPreviews(p); }} />
          </div>
          <div>
            <label className="text-small font-medium">Skills</label>
            <Select value={skills} onValueChange={setSkills}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Carpentry">Carpentry</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Tile Work">Tile Work</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-small font-medium">Client Feedback</label>
            <Textarea value={clientFeedback} onChange={e => setClientFeedback(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            <label htmlFor="isPublic" className="text-small">Public</label>
          </div>
          <DialogFooter className="md:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Portfolio'}</Button>
            {(error || localError) && <span className="text-red-600 text-small ml-2">{localError ?? error}</span>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


