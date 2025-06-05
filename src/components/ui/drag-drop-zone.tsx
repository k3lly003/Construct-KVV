'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GenericButton } from "@/components/ui/generic-button";
import Image from 'next/image';

interface DragDropZoneProps {
  onImagesChange: (images: { url: string; alt: string; isDefault: boolean }[]) => void;
  maxFiles?: number;
  images: { url: string; alt: string; isDefault: boolean }[];
}

export function DragDropZone({ onImagesChange, maxFiles = 10, images }: DragDropZoneProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    try {
      // Simulate image upload - replace with actual upload logic
      const newImages = await Promise.all(
        acceptedFiles.map(async (file) => {
          // This is a placeholder - replace with actual upload to your storage service
          const url = URL.createObjectURL(file);
          return {
            url,
            alt: file.name.split('.')[0],
            isDefault: images.length === 0, // First image is default
          };
        })
      );

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [images, maxFiles, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - images.length,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the default image, make the first remaining image default
    if (images[index].isDefault && newImages.length > 0) {
      newImages[0].isDefault = true;
    }
    onImagesChange(newImages);
  };

  const setDefaultImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isDefault: i === index
    }));
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          uploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} disabled={uploading} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-muted-foreground">PNG, JPG, JPEG or WEBP (max {maxFiles} files)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group border rounded-lg overflow-hidden bg-muted/50"
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isDefault && (
                    <GenericButton
                      size="sm"
                      variant="secondary"
                      onClick={() => setDefaultImage(index)}
                      className="text-xs"
                    >
                      Set Default
                    </GenericButton>
                  )}
                  <GenericButton
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </GenericButton>
                </div>
              </div>
              {image.isDefault && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Default
                </div>
              )}
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
