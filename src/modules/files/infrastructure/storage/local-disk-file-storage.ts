import { createHash } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  IFileStoragePort,
  SaveFileInput,
  SavedFileResult,
} from '../../application/ports/i-file-storage.port';

export class LocalDiskFileStorage implements IFileStoragePort {
  private rootDir() {
    // Static `public/uploads` keeps Turbopack file tracing scoped (UPLOAD_DIR is this folder).
    return path.join(process.cwd(), 'public', 'uploads');
  }

  async save(input: SaveFileInput): Promise<SavedFileResult> {
    const absoluteDirectory = path.join(
      this.rootDir(),
      input.relativeDirectory,
    );
    await mkdir(absoluteDirectory, { recursive: true });
    const absolutePath = path.join(absoluteDirectory, input.fileName);
    await writeFile(absolutePath, input.buffer);

    const publicUrl = `/uploads/${input.relativeDirectory}/${input.fileName}`
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/');

    return {
      absolutePath,
      publicUrl,
      fileName: input.fileName,
    };
  }

  async deleteByPublicUrl(fileUrl: string): Promise<void> {
    const relative = fileUrl.replace(/^\/uploads\//, '');
    const absolutePath = path.join(this.rootDir(), relative);
    try {
      await unlink(absolutePath);
    } catch {
      // file may already be gone
    }
  }
}

export function calculateChecksum(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

const IMAGE_MIME_BY_SIGNATURE: Array<{
  mime: string;
  match: (buffer: Buffer) => boolean;
}> = [
  {
    mime: 'image/jpeg',
    match: (buffer) =>
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  {
    mime: 'image/png',
    match: (buffer) =>
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47,
  },
  {
    mime: 'image/gif',
    match: (buffer) => {
      if (buffer.length < 6) {
        return false;
      }
      const header = buffer.subarray(0, 6).toString('ascii');
      return header === 'GIF87a' || header === 'GIF89a';
    },
  },
  {
    mime: 'image/webp',
    match: (buffer) =>
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  },
];

export function detectImageMimeType(buffer: Buffer): string | null {
  for (const candidate of IMAGE_MIME_BY_SIGNATURE) {
    if (candidate.match(buffer)) {
      return candidate.mime;
    }
  }
  return null;
}

export function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    default:
      return 'bin';
  }
}
