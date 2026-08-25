import { Component, signal, inject, computed, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
@Component({
  selector: 'app-user-menu',
  standalone: true,
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
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

  logout() {
    this.close();
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        // Même si l'appel échoue, on force quand même la redirection —
        // pas de raison de bloquer l'utilisateur sur une déconnexion ratée
        this.router.navigate(['/login']);
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
