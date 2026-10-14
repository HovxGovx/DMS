export interface AdvancedSearchRequest {
  keywords: string | null;
  format: string | null;
  language: string | null;
  creationDateStart: string | null; // ISO
  creationDateEnd: string | null;   // ISO
  fuzzy: boolean | null;
}