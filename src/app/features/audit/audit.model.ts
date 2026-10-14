import { DocTag } from '../documents/document.model';

export type AuditAction =
  | 'IMPORTED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'UNPUBLISHED'
  | 'CONFIDENTIALITY_CHANGED'
  | 'EDITED'
  | 'DELETED'
  | 'RETRIED'
  | 'OWNER_ASSIGNED'
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
  /** Classes de la pastille de la frise d'historique (fond + texte). */
  color: string;
  /** Sévérité PrimeNG de l'étiquette dans le journal, comme les tags du tableau des documents. */
  severity: DocTag['severity'];
}

export const AUDIT_ACTIONS: Record<AuditAction, AuditActionDisplay> = {
  IMPORTED: { label: 'Importé', icon: 'pi-upload', color: 'bg-slate-100 text-slate-600', severity: 'secondary' },
  VALIDATED: { label: 'Validé et publié', icon: 'pi-check-circle', color: 'bg-emerald-50 text-emerald-700', severity: 'success' },
  PUBLISHED: { label: 'Publié', icon: 'pi-eye', color: 'bg-emerald-50 text-emerald-700', severity: 'success' },
  UNPUBLISHED: { label: 'Retiré de la consultation', icon: 'pi-eye-slash', color: 'bg-amber-50 text-amber-700', severity: 'warn' },
  CONFIDENTIALITY_CHANGED: { label: 'Accès modifié', icon: 'pi-lock', color: 'bg-amber-50 text-amber-700', severity: 'warn' },
  EDITED: { label: 'Modifié dans OnlyOffice', icon: 'pi-pencil', color: 'bg-sky-50 text-sky-700', severity: 'info' },
  DELETED: { label: 'Supprimé', icon: 'pi-trash', color: 'bg-red-50 text-red-700', severity: 'danger' },
  RETRIED: { label: 'Relancé', icon: 'pi-replay', color: 'bg-sky-50 text-sky-700', severity: 'info' },
  OWNER_ASSIGNED: { label: 'Propriétaire rattaché', icon: 'pi-user-plus', color: 'bg-sky-50 text-sky-700', severity: 'info' },
  USER_DOMAINS_CHANGED: { label: 'Domaines modifiés', icon: 'pi-users', color: 'bg-prussian-blue-50 text-prussian-blue-700', severity: 'secondary' },
  INDEX_REBUILT: { label: 'Index reconstruit', icon: 'pi-search', color: 'bg-prussian-blue-50 text-prussian-blue-700', severity: 'secondary' }
};

/** Affichage d'une action ; une action ajoutée côté backend mais inconnue ici garde son code brut. */
export function auditActionDisplay(action: string): AuditActionDisplay {
  return AUDIT_ACTIONS[action as AuditAction] ?? { label: action, icon: 'pi-circle', color: 'bg-slate-100 text-slate-600', severity: 'secondary' };
}

export function formatAuditDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
