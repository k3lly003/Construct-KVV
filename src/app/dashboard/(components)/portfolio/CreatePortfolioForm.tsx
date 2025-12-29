'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePortfolio } from '@/app/hooks/usePortfolio';

export default function CreatePortfolioForm() {
  const { create, loading, error, lastMessage } = usePortfolio();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [images, setImages] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [skills, setSkills] = useState('');
  const [clientFeedback, setClientFeedback] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await create({
      title,
      description,
      workDate,
      images: images.split(',').map(s => s.trim()).filter(Boolean),
      category,
      location,
      budget,
      duration,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      clientFeedback: clientFeedback || undefined,
      isPublic,
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Portfolio</CardTitle>
        <CardDescription>Add your work to your public portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Input value={category} onChange={e => setCategory(e.target.value)} />
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
          <div>
            <label className="text-small font-medium">Images (comma separated URLs)</label>
            <Input value={images} onChange={e => setImages(e.target.value)} />
          </div>
          <div>
            <label className="text-small font-medium">Skills (comma separated)</label>
            <Input value={skills} onChange={e => setSkills(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-small font-medium">Client Feedback</label>
            <Textarea value={clientFeedback} onChange={e => setClientFeedback(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            <label htmlFor="isPublic" className="text-small">Public</label>
          </div>
          <div className="md:col-span-2 flex items-center gap-4">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Portfolio'}</Button>
            {error && <span className="text-red-600 text-small">{error}</span>}
            {lastMessage && !error && <span className="text-green-700 text-small">{lastMessage}</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


