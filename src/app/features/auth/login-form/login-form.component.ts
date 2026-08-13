import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, InputTextModule, CheckboxModule, IconFieldModule, InputIconModule],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  private router = inject(Router);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);

  onSubmit() {
    console.log('Connexion :', this.email(), this.rememberMe());
    // Pas encore de vraie vérification d'identifiants — on redirige direct pour tester le flux.
    // À remplacer par un appel au service d'authentification une fois le backend branché.
    this.router.navigate(['/']);
  }
}