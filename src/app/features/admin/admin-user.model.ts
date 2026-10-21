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

/** Compte créé par l'administration : écrit dans LDAP, puis ajouté à la GED avec ses domaines. */
export interface CreateUserRequest {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  domainCodes: string[];
}

export const ROLE_LABELS: Record<Role, string> = {
  READER: 'Lecteur',
  CONTRIBUTOR: 'Contributeur',
  VALIDATOR: 'Validateur',
  ADMIN: 'Administrateur'
};
