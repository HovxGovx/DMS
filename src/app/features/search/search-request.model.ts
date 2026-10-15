/** Le backend tolère les fautes de frappe par défaut : pas de champ fuzzy à envoyer. */
export interface AdvancedSearchRequest {
  keywords: string | null;
  format: string | null;
  language: string | null;
  creationDateStart: string | null; // ISO
  creationDateEnd: string | null;   // ISO
}

/** Filtres qui affinent la recherche de la barre ; dates au format 'YYYY-MM-DD' du champ date. */
export interface SearchFilters {
  format: string;
  language: string;
  startDate: string;
  endDate: string;
}

export const NO_FILTERS: SearchFilters = { format: '', language: '', startDate: '', endDate: '' };

export function activeFilterCount(filters: SearchFilters): number {
  return Object.values(filters).filter(value => value.trim() !== '').length;
}

export function toSearchRequest(keywords: string, filters: SearchFilters): AdvancedSearchRequest {
  return {
    keywords: keywords.trim() || null,
    format: filters.format.trim() || null,
    language: filters.language.trim() || null,
    creationDateStart: filters.startDate ? toLocalDayBound(filters.startDate, false) : null,
    creationDateEnd: filters.endDate ? toLocalDayBound(filters.endDate, true) : null
  };
}

// 'YYYY-MM-DD' -> début (00:00:00.000) ou fin (23:59:59.999) du jour en heure locale
function toLocalDayBound(value: string, endOfDay: boolean): string {
  const [year, month, day] = value.split('-').map(Number);
  const date = endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
  return date.toISOString();
}
