export interface ConfidenceScore {
  value: number; // 0-100
}

export interface SuggestedTag {
  label: string;
  status: 'accepted' | 'rejected' | 'pending';
}

export interface MetadataField {
  key: string;
  label: string;
  value: string;
}

export interface PendingImport {
  id: string;
  fileName: string;
  fileIcon: string;
  fileIconColor: string;
  suggestedType: string;
  typeConfidence: number;
  importedAt: string;
  fileFormat: string; // 'DOCX', 'PDF', 'XLSX'
  fileSize: string;
  pageCount?: number;

  suggestedTitle: string;
  documentType: string;
  documentTypeConfidence: number;
  confidentiality: string;
  confidentialityConfidence: number;

  tags: SuggestedTag[];
  metadataFields: MetadataField[];
  suggestedPath: string[];
}