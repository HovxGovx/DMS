export interface DocTag {
  label: string;
  severity: 'success' | 'info' | 'warn' | 'secondary' | 'danger';
}

export interface DocumentRow {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  locked?: boolean;
  tags: DocTag[];
  modified: string;
  modifiedDotColor: string;
  size: string;
}
export interface TagFilterOption {
  label: string;
  dotColor: string;   // ex: 'bg-emerald-500'
  textColor: string;  // ex: 'text-emerald-600'
  borderColor: string; // ex: 'border-emerald-300'
  bgActive: string;   // ex: 'bg-emerald-50'
}
export interface DocTag {
  label: string;
  severity: 'success' | 'info' | 'warn' | 'secondary' | 'danger';
}

export interface MetadataItem {
  label: string;
  value: string;
  dotColor?: string; // ex: 'bg-emerald-500', pour le statut workflow
}

export interface DocumentDetail {
  name: string;
  docId: string;
  icon: string;
  iconColor: string;
  tags: DocTag[];
  systemMetadata: MetadataItem[];
  businessMetadata: MetadataItem[];
  aiSummary: string;
}