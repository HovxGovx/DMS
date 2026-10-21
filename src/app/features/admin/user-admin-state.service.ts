import { Injectable, computed, inject, signal } from '@angular/core';
import { UserAdminService } from './user-admin.service';
import { AdminUser } from './admin-user.model';

@Injectable({ providedIn: 'root' })
export class UserAdminStateService {
  private userAdminService = inject(UserAdminService);

  users = signal<AdminUser[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  /** Filtre texte (nom, identifiant ou email). */
  filter = signal('');
  /** N'affiche que les utilisateurs sans domaine. */
  onlyWithoutDomain = signal(false);

  /**
   * Utilisateurs sans domaine : ils ne voient que leurs propres imports.
   * Les administrateurs voient tout, leurs domaines ne comptent pas.
   */
  withoutDomainCount = computed(() => this.users().filter(isWithoutDomain).length);

  filteredUsers = computed(() => {
    const term = this.filter().trim().toLowerCase();
    return this.users()
      .filter(u => !this.onlyWithoutDomain() || isWithoutDomain(u))
      .filter(u => !term
        || u.fullName?.toLowerCase().includes(term)
        || u.uid.toLowerCase().includes(term)
        || u.email?.toLowerCase().includes(term))
      .sort((a, b) => (a.fullName ?? a.uid).localeCompare(b.fullName ?? b.uid));
  });

  loadUsers() {
    this.isLoading.set(true);
    this.loadError.set(null);
    this.userAdminService.getUsers().subscribe({
      next: users => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('Impossible de charger les utilisateurs.');
      }
    });
  }

  addUser(created: AdminUser) {
    this.users.update(users => [...users, created]);
  }

  /** Remplace un utilisateur par sa version renvoyée par le backend après modification. */
  replaceUser(updated: AdminUser) {
    this.users.update(users => users.map(u => u.id === updated.id ? updated : u));
  }
}

export function isWithoutDomain(user: AdminUser): boolean {
  return user.role !== 'ADMIN' && user.domainCodes.length === 0;
}
