export const IMAGE_VARIANT = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  ORIGINAL: "original",
} as const;

export type ImageVariant = (typeof IMAGE_VARIANT)[keyof typeof IMAGE_VARIANT];

/** Max width (px) for resized webp variants. ORIGINAL is not resized. */
export const IMAGE_VARIANT_MAX_WIDTH: Record<
  Exclude<ImageVariant, "original">,
  number
> = {
  low: 400,
  medium: 800,
  high: 1600,
};

export const IMAGE_VARIANT_WEBP_QUALITY = 80;

export type ProductImageFileMetadata = {
  urls: string[];
};

export function buildImageVariantFileName(
  variant: ImageVariant,
  baseId: string,
  extension: string,
): string {
  return `${variant}_${baseId}.${extension}`;
}

export function isProductImageFileMetadata(
  value: unknown,
): value is ProductImageFileMetadata {
  if (!value || typeof value !== "object") {
    return false;
  }
  const urls = (value as { urls?: unknown }).urls;
  return Array.isArray(urls) && urls.every((item) => typeof item === "string");
}

export function resolveProductImageUrls(
  fileUrl: string,
  metadata: unknown,
): string[] {
  if (isProductImageFileMetadata(metadata) && metadata.urls.length > 0) {
    return metadata.urls;
  }
  return [fileUrl];
}
