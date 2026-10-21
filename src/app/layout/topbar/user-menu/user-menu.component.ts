import { Component, signal, inject, computed, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { ViewStateService } from '../../../core/view-state.service';
import { DropdownBackdropComponent } from '../../../shared/dropdown-backdrop/dropdown-backdrop.component';
import { ROLE_LABELS } from '../../../features/admin/admin-user.model';
@Component({
  selector: 'app-user-menu',
  standalone: true,
  templateUrl: './user-menu.component.html',
  imports: [DropdownBackdropComponent]
})
export class UserMenuComponent {
  authService = inject(AuthService);
  viewState = inject(ViewStateService);
  private elementRef = inject(ElementRef);

  isOpen = signal(false);

  userName = computed(() => this.authService.currentUser()?.fullName ?? '...');
  userUid = computed(() => this.authService.currentUser()?.uid ?? '');
  /** Rôle en clair : utile pour savoir avec quel compte on travaille (démonstration à plusieurs comptes). */
  userRole = computed(() => {
    const role = this.authService.currentUser()?.role;
    return role ? ROLE_LABELS[role] : '';
  });
  userInitials = computed(() => {
    const name = this.authService.currentUser()?.fullName;
    if (!name) return '..';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  openAdministration() {
    this.close();
    this.viewState.setView('admin');
  }

  logout() {
    this.close();
    // Rechargement complet plutôt qu'une navigation : les services gardent en mémoire la vue,
    // les dossiers, les documents et la réponse du RAG, que le compte suivant ne doit pas retrouver
    this.authService.logout().subscribe({
      next: () => window.location.assign('/login'),
      error: () => {
        // Même si l'appel échoue, on force quand même la redirection —
        // pas de raison de bloquer l'utilisateur sur une déconnexion ratée
        window.location.assign('/login');
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }

  // Ferme le menu si on clique n'importe où en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
