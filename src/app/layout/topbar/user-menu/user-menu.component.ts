import { Component, signal, inject, computed, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { ViewStateService } from '../../../core/view-state.service';
import { DropdownBackdropComponent } from '../../../shared/dropdown-backdrop/dropdown-backdrop.component';
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
  userRole = computed(() => this.authService.currentUser()?.role ?? '');
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

  // Ferme le menu si on clique n'importe où en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
