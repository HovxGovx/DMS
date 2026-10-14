import { DocumentStatus } from '../validation/lifecycle-document.model';

/** Ancien import sans propriétaire : seul l'administrateur peut le traiter. */
export interface OwnerlessDocument {
  id: string;
  fileName: string;
  title: string | null;
  status: DocumentStatus;
  importDate: string;
}
