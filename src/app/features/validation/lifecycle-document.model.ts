export type DocumentStatus = 'IMPORTED' | 'PENDING_VALIDATION' | 'EXTRACTION_FAILED' | 'PUBLISHED' | 'UNPUBLISHED' | 'INDEXING_FAILED';

/** Qui peut lire un document publié : tout le monde, ou seulement la personne qui l'a importé et les validateurs. */
export type Confidentiality = 'PUBLIC' | 'CONFIDENTIAL';

export interface LifecycleDocument {
  id: string;
  originalFileName: string;
  status: DocumentStatus;
  importDate: string;
  storageReference: string;
  confidentiality: Confidentiality;
  /** L'utilisateur courant peut agir sur le document (retrait, confidentialité) : admin, auteur de l'import, ou validateur d'un de ses domaines. */
  manageable: boolean;
}

export interface BatchUploadResult {
  successCount: number;
  failureCount: number;
  failedFiles: string[];
}