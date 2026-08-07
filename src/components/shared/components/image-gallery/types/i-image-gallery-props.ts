export type ImageGalleryItem = {
  id: string;
  /** Main / thumbs preview (medium). */
  src: string;
  /** Fullscreen lightbox source (high). */
  fullscreenSrc?: string;
  alt?: string;
};

export type ImageGalleryProps = {
  images: ImageGalleryItem[];
  /** Fallback label when there are no images */
  emptyLabel?: string;
  className?: string;
};
