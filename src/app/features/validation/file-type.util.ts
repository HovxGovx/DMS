export interface FileTypeInfo {
  label: string;
  icon: string;
  color: string;
}

const FILE_TYPES: Record<string, FileTypeInfo> = {
  pdf: { label: 'PDF', icon: 'pi pi-file-pdf', color: 'text-red-500' },
  doc: { label: 'DOC', icon: 'pi pi-file-word', color: 'text-blue-600' },
  docx: { label: 'DOCX', icon: 'pi pi-file-word', color: 'text-blue-600' },
  xls: { label: 'XLS', icon: 'pi pi-file-excel', color: 'text-green-600' },
  xlsx: { label: 'XLSX', icon: 'pi pi-file-excel', color: 'text-green-600' },
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