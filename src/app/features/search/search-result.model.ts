export interface SearchResult {
  id: string;
  originalFileName: string;
  title: string | null;
  author: string | null;
  format: string;
  score: number;
}