// Types pour l'upload
export type UploadedFile = {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt: string;
};

export type UploadResponse = {
  file: UploadedFile;
  message: string;
};

export type MultipleUploadResponse = {
  files: UploadedFile[];
  count: number;
  message: string;
};
