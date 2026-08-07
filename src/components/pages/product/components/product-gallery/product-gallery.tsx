"use client";

import { ImageGallery } from "@/components/shared/components/image-gallery/image-gallery";
import { pickImageUrlByVariant } from "@/utils/pick-image-url-by-variant.util";

type GalleryImage = {
  id: string;
  fileUrl: string;
  urls: string[];
  originalName: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  return (
    <ImageGallery
      images={images.map((image) => {
        const urls = image.urls.length > 0 ? image.urls : [image.fileUrl];
        return {
          id: image.id,
          src: pickImageUrlByVariant(urls, "medium", image.fileUrl),
          fullscreenSrc: pickImageUrlByVariant(urls, "high", image.fileUrl),
          alt: productName,
        };
      })}
      emptyLabel={productName}
    />
  );
}
