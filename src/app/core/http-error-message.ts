import { HttpErrorResponse } from '@angular/common/http';

/** Messages propres à une action, par statut HTTP (ex : 409 → « déjà publié »). */
export type MessagesByStatus = Partial<Record<number, string>>;

/** Sens commun d'un statut, quand l'action n'en donne pas un plus précis. */
const COMMON_MESSAGES: MessagesByStatus = {
  0: 'Serveur injoignable : vérifiez votre connexion, puis réessayez.',
  403: 'Vos droits ne permettent pas cette action.',
  404: "L'élément n'existe plus : rechargez la page.",
  409: "L'action n'est plus possible : les données ont changé entre-temps. Rechargez la page.",
  413: 'Envoi trop volumineux.',
  503: 'Service momentanément indisponible. Réessayez dans quelques instants.'
};

/**
 * Message affiché à l'utilisateur après l'échec d'un appel HTTP.
 * Le texte renvoyé par le backend s'adresse aux développeurs (anglais, identifiants) : il n'est jamais affiché.
 * Ordre : message de l'action pour ce statut, puis sens commun du statut, puis `fallback` (erreur 400 ou 500 surtout).
 */
export function httpErrorMessage(err: unknown, fallback: string, byStatus: MessagesByStatus = {}): string {
  const status = err instanceof HttpErrorResponse ? err.status : -1;
  return byStatus[status] ?? COMMON_MESSAGES[status] ?? fallback;
}
