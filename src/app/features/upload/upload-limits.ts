/**
 * Limites d'import, à garder alignées sur le backend (application.yml : gestion-lifecycle.allowed-formats
 * et spring.servlet.multipart) et sur client_max_body_size de nginx.conf.
 * Un lot part en une seule requête : son total est limité aussi.
 */
export const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'rtf'];

/** Valeur de l'attribut accept du sélecteur de fichiers (.pdf,.doc,…). */
export const ACCEPT_ATTRIBUTE = ALLOWED_EXTENSIONS.map(extension => `.${extension}`).join(',');

export const MAX_FILE_SIZE_MB = 100;
export const MAX_BATCH_SIZE_MB = 250;

const BYTES_PER_MB = 1024 * 1024;

export function toMegabytes(bytes: number): number {
  return Math.ceil(bytes / BYTES_PER_MB);
}

export function isAllowedFormat(file: File): boolean {
  const dot = file.name.lastIndexOf('.');
  return dot > 0 && ALLOWED_EXTENSIONS.includes(file.name.substring(dot + 1).toLowerCase());
}

export function isFileTooLarge(file: File): boolean {
  return file.size > MAX_FILE_SIZE_MB * BYTES_PER_MB;
}

export function isBatchTooLarge(files: File[]): boolean {
  return totalSize(files) > MAX_BATCH_SIZE_MB * BYTES_PER_MB;
}

export function totalSize(files: File[]): number {
  return files.reduce((sum, file) => sum + file.size, 0);
}
