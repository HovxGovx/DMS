import { Role } from '../../core/auth.service';

/** Utilisateur vu par l'administration : son rôle vient de LDAP, ses domaines sont affectés ici. */
export interface AdminUser {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  role: Role;
  domainCodes: string[];
}

export const ROLE_LABELS: Record<Role, string> = {
  READER: 'Lecteur',
  CONTRIBUTOR: 'Contributeur',
  VALIDATOR: 'Validateur',
  ADMIN: 'Administrateur'
};
