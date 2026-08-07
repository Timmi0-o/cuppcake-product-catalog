import { randomUUID } from "node:crypto";
import sharp from "sharp";
import type {
  IImageVariantProcessorPort,
  ProcessedImageVariantFile,
  ProcessedImageVariantsResult,
} from "../../application/ports/i-image-variant-processor.port";
import { InvalidFileTypeError } from "../../domain/entities/file";
import {
  buildImageVariantFileName,
  IMAGE_VARIANT,
  IMAGE_VARIANT_MAX_WIDTH,
  IMAGE_VARIANT_WEBP_EFFORT,
  IMAGE_VARIANT_WEBP_QUALITY,
  type ImageVariant,
} from "../../domain/entities/file/image-variant";
import {
  detectImageMimeType,
  extensionForMime,
} from "../storage/local-disk-file-storage";

const WEBP_MIME = "image/webp";

export class SharpImageVariantProcessor implements IImageVariantProcessorPort {
  async process(input: {
    buffer: Buffer;
    originalName: string;
  }): Promise<ProcessedImageVariantsResult> {
    const sourceMimeType = detectImageMimeType(input.buffer);
    if (!sourceMimeType) {
      throw new InvalidFileTypeError(input.originalName);
    }

    const baseId = randomUUID();
    const originalExtension = extensionForMime(sourceMimeType);
    const pipeline = sharp(input.buffer, { failOn: "none" }).rotate();

    const resizedVariants: Array<Exclude<ImageVariant, "original">> = [
      IMAGE_VARIANT.LOW,
      IMAGE_VARIANT.MEDIUM,
      IMAGE_VARIANT.HIGH,
    ];

    const files: ProcessedImageVariantFile[] = [];

    for (const variant of resizedVariants) {
      const buffer = await pipeline
        .clone()
        .resize({
          width: IMAGE_VARIANT_MAX_WIDTH[variant],
          withoutEnlargement: true,
          fit: "inside",
        })
        .webp({
          quality: IMAGE_VARIANT_WEBP_QUALITY,
          effort: IMAGE_VARIANT_WEBP_EFFORT,
        })
        .toBuffer();

      files.push({
        variant,
        fileName: buildImageVariantFileName(variant, baseId, "webp"),
        mimeType: WEBP_MIME,
        buffer,
      });
    }

    files.push({
      variant: IMAGE_VARIANT.ORIGINAL,
      fileName: buildImageVariantFileName(
        IMAGE_VARIANT.ORIGINAL,
        baseId,
        originalExtension,
      ),
      mimeType: sourceMimeType,
      buffer: input.buffer,
    });

    return {
      baseId,
      originalName: input.originalName,
      files,
    };
  }
}
