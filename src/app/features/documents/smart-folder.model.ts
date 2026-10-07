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
  tags: string[];
}

export interface FolderDocumentsPage {
  content: FolderDocument[];
  page: number;
  size: number;
  total: number;
}
export type CriterionFieldCode = 'DOMAIN' | 'TYPE' | 'TITLE' | 'TAG';
export type CriterionOperator = 'EQUALS' | 'CONTAINS' | 'IS_EMPTY';

export interface Criterion {
  field: CriterionFieldCode;
  operator: CriterionOperator;
  value: string | null;
}

export interface CriterionValueOption {
  value: string;
  label: string;
}

export interface CriterionFieldDefinition {
  field: CriterionFieldCode;
  label: string;
  operators: CriterionOperator[];
  values: CriterionValueOption[];
}

export interface SmartFolderDetail {
  id: string;
  parentId: string | null;
  name: string;
  system: boolean;
  criteria: Criterion[];
  inheritedCriteria: Criterion[];
}

export type SmartFolderSummary = Omit<SmartFolderNode, 'documentCount'>;

export interface CreateSmartFolderRequest {
  parentId: string | null;
  name: string;
  criteria: Criterion[];
}

export interface UpdateSmartFolderRequest {
  name: string;
  criteria: Criterion[];
}