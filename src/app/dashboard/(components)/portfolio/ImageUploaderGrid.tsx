'use client';

import { useRef } from 'react';

interface Props {
  files: File[];
  previews: string[];
  onChange: (files: File[], previews: string[]) => void;
  max?: number;
}

export default function ImageUploaderGrid({ files, previews, onChange, max = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFiles(selectedList: FileList | null) {
    if (!selectedList) return;
    const selected = Array.from(selectedList);
    const nextFiles = [...files, ...selected].slice(0, max);
    const nextPreviews = nextFiles.map(f => URL.createObjectURL(f));
    onChange(nextFiles, nextPreviews);
  }

  function removeAt(index: number) {
    const nextFiles = files.filter((_, i) => i !== index);
    const nextPreviews = previews.filter((_, i) => i !== index);
    onChange(nextFiles, nextPreviews);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="grid grid-cols-3 gap-3">
        {/* Upload tile */}
        <button
          type="button"
          onClick={openPicker}
          className="flex items-center justify-center h-28 rounded border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 text-sm text-muted-foreground"
        >
          Click to Upload
        </button>

        {/* Thumbnails */}
        {previews.map((src, idx) => (
          <div key={idx} className="relative h-28 rounded overflow-hidden group">
            <img src={src} alt={`preview-${idx}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 text-white text-xs"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


