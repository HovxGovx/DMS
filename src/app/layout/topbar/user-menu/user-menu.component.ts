import { Component, signal, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent {
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isOpen = signal(false);

  userName = 'Elena Marquez';
  userRole = 'System Admin';
  userInitials = 'EM';

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  logout() {
    this.close();
    // Pas encore de vraie déconnexion côté serveur (invalidation de session/token) —
    // à brancher une fois le service d'authentification prêt.
    this.router.navigate(['/login']);
  }

  // Ferme le menu si on clique n'importe où en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}