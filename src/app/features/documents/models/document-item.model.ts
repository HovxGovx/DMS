export type TagSeverity = 'invoice' | 'spreadsheet' | 'contract' | 'confidential' | 'receipt' | 'master-data' | 'verified';

export interface DocTag {
  label: string;
  severity: TagSeverity;
}

export interface DocumentItem {
  id: string;
  name: string;
  icon: string;          // classe pi- (pi-file-pdf, pi-file-excel...)
  iconColor: string;     // classe tailwind text-*
  tags: DocTag[];
  modifiedLabel: string; // '2h ago', 'Yesterday'...
  sizeLabel: string;
  restricted?: boolean;
}