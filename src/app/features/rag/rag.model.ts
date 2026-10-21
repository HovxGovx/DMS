/** Document cité par une réponse (RagSourceResponse côté backend). */
export interface RagSource {
  documentId: string;
  title: string | null;
  /** Distance du passage le plus proche de la question : plus elle est petite, plus il est pertinent. */
  distance: number;
}

/** Réponse de POST /api/dms/rag/ask : sans source quand rien n'a été trouvé dans les documents lisibles. */
export interface RagAnswer {
  answer: string;
  sources: RagSource[];
}
