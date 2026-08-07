import { DomainError } from '@shared/domain/errors';

export class FileNotFoundError extends DomainError {
  constructor(fileId: string) {
    super('FILE_NOT_FOUND', `File not found: ${fileId}`, { fileId });
  }
}

export class InvalidFileTypeError extends DomainError {
  constructor(mimeType: string) {
    super('INVALID_FILE_TYPE', `Unsupported file type: ${mimeType}`, {
      mimeType,
    });
  }
}

export class FileTooLargeError extends DomainError {
  constructor(size: number, maxSize: number) {
    super(
      'FILE_TOO_LARGE',
      `File size ${size} exceeds max ${maxSize} bytes`,
      { size, maxSize },
    );
  }
}
