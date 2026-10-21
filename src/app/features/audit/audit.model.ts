import { DocTag } from '../documents/document.model';

export type AuditAction =
  | 'IMPORTED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'UNPUBLISHED'
  | 'CONFIDENTIALITY_CHANGED'
  | 'EDITED'
  | 'VIEWED'
  | 'DELETED'
  | 'RETRIED'
  | 'OWNER_ASSIGNED'
  | 'USER_CREATED'
  | 'USER_DOMAINS_CHANGED'
  | 'INDEX_REBUILT';

/** Une ligne du journal : qui a fait quoi, sur quel document, quand. */
export interface AuditEntry {
  id: string;
  occurredAt: string;
  action: AuditAction;
  actorId: string | null;
  /** null : action sans utilisateur (démarrage) ou compte disparu. */
  actorName: string | null;
  /** null : action qui ne porte pas sur un document (domaines, index). */
  documentId: string | null;
  /** Titre validé, sinon nom du fichier ; reste lisible après la suppression du document. */
  documentName: string | null;
  detail: string | null;
}

export interface AuditPage {
  content: AuditEntry[];
  page: number;
  size: number;
  total: number;
}

export interface AuditFilter {
  actorId: string | null;
  action: AuditAction | null;
  /** Jours au format yyyy-mm-dd (champ date du navigateur), bornes incluses. */
  fromDay: string | null;
  toDay: string | null;
}

export interface AuditActionDisplay {
  label: string;
  icon: string;
  /** Sévérité PrimeNG de l'étiquette dans le journal, comme les tags du tableau des documents. */
  severity: DocTag['severity'];
}

export const AUDIT_ACTIONS: Record<AuditAction, AuditActionDisplay> = {
  IMPORTED: { label: 'Importé', icon: 'pi-upload', severity: 'secondary' },
  VALIDATED: { label: 'Validé et publié', icon: 'pi-check-circle', severity: 'success' },
  PUBLISHED: { label: 'Publié', icon: 'pi-eye', severity: 'success' },
  UNPUBLISHED: { label: 'Retiré de la consultation', icon: 'pi-eye-slash', severity: 'warn' },
  CONFIDENTIALITY_CHANGED: { label: 'Accès modifié', icon: 'pi-lock', severity: 'warn' },
  EDITED: { label: 'Modifié dans OnlyOffice', icon: 'pi-pencil', severity: 'info' },
  VIEWED: { label: 'Consulté', icon: 'pi-book', severity: 'secondary' },
  DELETED: { label: 'Supprimé', icon: 'pi-trash', severity: 'danger' },
  RETRIED: { label: 'Relancé', icon: 'pi-replay', severity: 'info' },
  OWNER_ASSIGNED: { label: 'Propriétaire rattaché', icon: 'pi-user-plus', severity: 'info' },
  USER_CREATED: { label: 'Compte créé', icon: 'pi-id-card', severity: 'secondary' },
  USER_DOMAINS_CHANGED: { label: 'Domaines modifiés', icon: 'pi-users', severity: 'secondary' },
  INDEX_REBUILT: { label: 'Index reconstruit', icon: 'pi-search', severity: 'secondary' }
};

/** Affichage d'une action ; une action ajoutée côté backend mais inconnue ici garde son code brut. */
export function auditActionDisplay(action: string): AuditActionDisplay {
  return AUDIT_ACTIONS[action as AuditAction] ?? { label: action, icon: 'pi-circle', severity: 'secondary' };
}

export function formatAuditDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
