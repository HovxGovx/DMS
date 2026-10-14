import { Component } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AuthOverlayComponent } from '../auth-overlay/auth-overlay.component';

/** Les comptes viennent de l'annuaire LDAP : la page ne propose que la connexion. */
@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [LoginFormComponent, AuthOverlayComponent],
  templateUrl: './auth-page.component.html'
})
export class AuthPageComponent {}
