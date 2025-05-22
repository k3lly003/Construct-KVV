import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageOption {
  id: string;
  src: string;
  alt: string;
  label: string;
}

interface ImageSelectorProps {
  options: ImageOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageSelector({
  options,
  value,
  onChange,
  className,
}: ImageSelectorProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {options.map((option) => (
        <div
          key={option.id}
          className={cn(
            'relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all duration-200',
            'hover:shadow-md transform hover:-translate-y-1',
            value === option.id ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-border hover:border-input'
          )}
          onClick={() => onChange(option.id)}
        >
          <div className="relative aspect-[4/3] w-full">
            <Image 
              src={option.src}
              alt={option.alt}
              fill
              className="object-cover"
            />
            <div className={cn(
              'absolute inset-0 bg-black/5 transition-opacity',
              value === option.id ? 'opacity-0' : 'opacity-100'
            )} />
          </div>
          <div className="p-3 bg-background">
            <p className="font-medium text-center">{option.label}</p>
          </div>
          {value === option.id && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}