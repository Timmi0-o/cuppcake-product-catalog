import type { ImageVariant } from "../../domain/entities/file/image-variant";

export type ProcessedImageVariantFile = {
  variant: ImageVariant;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
};

export type ProcessedImageVariantsResult = {
  baseId: string;
  originalName: string;
  /** Disk files: low/medium/high webp + original in source format */
  files: ProcessedImageVariantFile[];
};

export interface IImageVariantProcessorPort {
  process(input: {
    buffer: Buffer;
    originalName: string;
  }): Promise<ProcessedImageVariantsResult>;
}

export const IMAGE_VARIANT_PROCESSOR_TOKEN = Symbol(
  "IImageVariantProcessorPort",
);
