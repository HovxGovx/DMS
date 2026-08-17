export interface DocTag {
  label: string;
  severity: 'success' | 'info' | 'warn' | 'secondary' | 'danger';
}

export interface DocumentItem {
  id: string;
  name: string;
  format: 'PDF' | 'XLSX' | 'DOCX';
  icon: string;
  iconColor: string;
  category: string;
  categorySeverity: DocTag['severity'];
  tags: DocTag[];
  modified: string;
  modifiedDotColor: string;
  size: string;
  locked?: boolean;
  owner: string;
  createdAt: string;
  department: string;
  expiry: string;
  aiSummary: string;
}

export interface TagFilterOption {
  label: string;
  dotColor: string;
  textColor: string;
  borderColor: string;
  bgActive: string;
}

export interface MetadataItem {
  label: string;
  value: string;
  dotColor?: string;
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

export function toDocumentDetail(item: DocumentItem): DocumentDetail {
  return {
    name: item.name,
    docId: item.id,
    icon: item.icon,
    iconColor: item.iconColor,
    tags: [{ label: item.category, severity: item.categorySeverity }, ...item.tags],
    systemMetadata: [
      { label: 'Auteur', value: item.owner },
      { label: 'Créé le', value: item.createdAt },
      { label: 'Modifié le', value: item.modified },
      { label: 'Taille', value: item.size },
      { label: 'Format', value: item.format }
    ],
    businessMetadata: [
      { label: 'Département', value: item.department },
      { label: "Date d'expiration", value: item.expiry },
      
    ],
    aiSummary: item.aiSummary
  };
}