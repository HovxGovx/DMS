export type DocumentStatus = 'IMPORTED' | 'PENDING_VALIDATION' | 'EXTRACTION_FAILED' | 'PUBLISHED' | 'INDEXING_FAILED';

export interface LifecycleDocument {
  id: string;
  originalFileName: string;
  status: DocumentStatus;
  importDate: string;
  storageReference: string;
}

export interface BatchUploadResult {
  successCount: number;
  failureCount: number;
  failedFiles: string[];
}