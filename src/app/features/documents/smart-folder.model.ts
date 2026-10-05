import { DocumentStatus } from '../validation/lifecycle-document.model';

export interface SmartFolderNode {
  id: string;
  parentId: string | null;
  name: string;
  system: boolean;
  hasChildren: boolean;
  documentCount: number;
}

export interface FolderDocument {
  id: string;
  originalFileName: string;
  status: DocumentStatus;
  importDate: string;
  storageReference: string;
  title: string | null;
  typeCode: string | null;
  typeLabel: string | null;
  domainCode: string | null;
  domainLabel: string | null;
}

export interface FolderDocumentsPage {
  content: FolderDocument[];
  page: number;
  size: number;
  total: number;
}