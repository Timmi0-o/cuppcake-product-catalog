'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type GalleryImage = {
  id: string;
  fileUrl: string;
  originalName: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-muted">
        <span className="font-display text-3xl text-primary/35">
          {productName}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-[0_20px_50px_rgb(20_40_30_/_0.12)]">
        <Image
          key={active.id}
          src={active.fileUrl}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="animate-in fade-in object-cover duration-300"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-lg border transition-opacity',
                index === activeIndex
                  ? 'border-primary opacity-100'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image
                src={image.fileUrl}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
