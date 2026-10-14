import { Confidentiality, DocumentStatus } from './lifecycle-document.model';

export type TagStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type TagOrigin = 'LUCENE' | 'USER';

export interface DocumentTag {
  id: string;
  label: string;
  status: TagStatus;
  origin: TagOrigin;
}

/** Élément de la file « À publier » (GET /api/dms/document/pending-validation) : nouvel import ou document retiré de la consultation. */
export interface PendingDocument {
  id: string;
  fileName: string;
  importDate: string;
  format: string | null;
  fileSize: string | null;
  pageCount: number | null;
  title: string;
  status: DocumentStatus;
}

export interface ValidationDetail {
  id: string;
  fileName: string;
  importDate: string;
  status: DocumentStatus;
  confidentiality: Confidentiality;
  format: string | null;
  fileSize: string | null;
  pageCount: number | null;
  language: string | null;
  title: string;
  typeCode: string | null;
  typeLabel: string | null;
  domainCode: string | null;
  domainLabel: string | null;
  tags: DocumentTag[];
}

export interface TaxonomyType {
  code: string;
  label: string;
}

export interface TaxonomyDomain {
  code: string;
  label: string;
  fallback: boolean;
  types: TaxonomyType[];
}

export interface ValidateDocumentRequest {
  title: string;
  typeCode: string;
  confidentiality: Confidentiality;
}