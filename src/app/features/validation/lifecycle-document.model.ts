export type DocumentStatus = 'PENDING_VALIDATION' | 'PUBLISHED';

export interface LifecycleDocument {
  id: string;
  fileName: string;
  status: DocumentStatus;
  importDate: string; // ISO string
  storageReference: string;
}