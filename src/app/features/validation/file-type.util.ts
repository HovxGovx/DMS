export interface FileTypeInfo {
  label: string;
  icon: string;
  color: string;
}

const FILE_TYPES: Record<string, FileTypeInfo> = {
  pdf: { label: 'PDF', icon: 'pi pi-file-pdf', color: 'text-red-500' },
  doc: { label: 'DOC', icon: 'pi pi-file-word', color: 'text-blue-600' },
  docx: { label: 'DOCX', icon: 'pi pi-file-word', color: 'text-blue-600' },
  odt: { label: 'ODT', icon: 'pi pi-file-word', color: 'text-blue-600' },
  rtf: { label: 'RTF', icon: 'pi pi-file-word', color: 'text-blue-600' },
  xls: { label: 'XLS', icon: 'pi pi-file-excel', color: 'text-green-600' },
  xlsx: { label: 'XLSX', icon: 'pi pi-file-excel', color: 'text-green-600' },
  ods: { label: 'ODS', icon: 'pi pi-file-excel', color: 'text-green-600' },
  ppt: { label: 'PPT', icon: 'pi pi-file', color: 'text-orange-600' },
  pptx: { label: 'PPTX', icon: 'pi pi-file', color: 'text-orange-600' },
  odp: { label: 'ODP', icon: 'pi pi-file', color: 'text-orange-600' },
  csv: { label: 'CSV', icon: 'pi pi-file-excel', color: 'text-green-600' }
};

export function getFileTypeInfo(fileName: string): FileTypeInfo {
  const extension = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : '';
  return FILE_TYPES[extension] ?? {
    label: extension ? extension.toUpperCase() : 'FICHIER',
    icon: 'pi pi-file',
    color: 'text-prussian-blue-400'
  };
}
export function getDisplayName(fileName: string): string {
  const extensionIndex = fileName.lastIndexOf('.');
  return extensionIndex > 0 ? fileName.substring(0, extensionIndex) : fileName;
}