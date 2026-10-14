import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from '../../../core/auth.service';
import { NotificationService } from '../../../core/notification.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);

  uid = signal('');
  password = signal('');

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login(this.uid(), this.password()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notification.success('Connexion réussie.');
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Identifiants incorrects ou serveur inaccessible.');
      }
    });
  }
}