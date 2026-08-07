export type SaveFileInput = {
  relativeDirectory: string;
  fileName: string;
  buffer: Buffer;
};

export type SavedFileResult = {
  absolutePath: string;
  publicUrl: string;
  fileName: string;
};

export interface IFileStoragePort {
  save(input: SaveFileInput): Promise<SavedFileResult>;
  deleteByPublicUrl(fileUrl: string): Promise<void>;
}

export const FILE_STORAGE_PORT_TOKEN = Symbol('IFileStoragePort');
