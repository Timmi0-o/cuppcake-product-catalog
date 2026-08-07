export enum FileStatus {
  PENDING = "PENDING",
  UPLOADED = "UPLOADED",
}

export enum FileType {
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
}

export enum FilePurpose {
  PRODUCT_IMAGE = "PRODUCT_IMAGE",
}

export type IFileEntity = {
  id: string;
  uploadedBy: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: bigint;
  fileUrl: string;
  checksum: string | null;
  status: FileStatus;
  fileType: FileType;
  purpose: FilePurpose;
  metadata: Record<string, unknown> | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ICreateFileInput = {
  uploadedBy: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: bigint;
  fileUrl: string;
  checksum: string | null;
  status: FileStatus;
  fileType: FileType;
  purpose: FilePurpose;
  metadata?: Record<string, unknown> | null;
  tags?: string[];
};

export type IFilePublicEntity = {
  id: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  fileType: FileType;
  purpose: FilePurpose;
  status: FileStatus;
  fileSize: bigint;
  checksum: string | null;
  createdAt: Date;
  updatedAt: Date;
};
