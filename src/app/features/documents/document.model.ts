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
      {
        label: 'Statut Workflow',
        value: 'Approuvé',
        dotColor: 'bg-emerald-500'
      }
    ],
    aiSummary: item.aiSummary
  };
}
export interface TagFilterOption {
  label: string;
  dotColor: string;
  textColor: string;
  borderColor: string;
  bgActive: string;
}

export const SEVERITY_FILTER_COLORS: Record<DocTag['severity'], Omit<TagFilterOption, 'label'>> = {
  success: { dotColor: 'bg-emerald-500', textColor: 'text-emerald-600', borderColor: 'border-emerald-300', bgActive: 'bg-emerald-50' },
  warn: { dotColor: 'bg-orange-500', textColor: 'text-orange-600', borderColor: 'border-orange-300', bgActive: 'bg-orange-50' },
  info: { dotColor: 'bg-blue-500', textColor: 'text-blue-600', borderColor: 'border-blue-300', bgActive: 'bg-blue-50' },
  secondary: { dotColor: 'bg-prussian-blue-500', textColor: 'text-prussian-blue-600', borderColor: 'border-prussian-blue-300', bgActive: 'bg-prussian-blue-50' },
  danger: { dotColor: 'bg-red-500', textColor: 'text-red-600', borderColor: 'border-red-300', bgActive: 'bg-red-50' }
};