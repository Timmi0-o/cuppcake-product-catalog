export type ImageUrlVariant = "low" | "medium" | "high" | "original";

/**
 * Picks a variant URL by filename prefix (`low_`, `medium_`, `high_`, `original_`).
 */
export function pickImageUrlByVariant(
  urls: string[],
  variant: ImageUrlVariant,
  fallbackUrl?: string,
): string {
  const prefix = `${variant}_`;
  const matched = urls.find((url) => {
    const fileName = url.split("/").pop() ?? "";
    return fileName.startsWith(prefix);
  });

  if (matched) {
    return matched;
  }

  if (fallbackUrl) {
    return fallbackUrl;
  }

  return urls[0] ?? "";
}
