import { Component, signal } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';
import { AuthOverlayComponent } from '../auth-overlay/auth-overlay.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [LoginFormComponent, SignupFormComponent, AuthOverlayComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  mode = signal<'signin' | 'signup'>('signin');

  switchToSignup() {
    this.mode.set('signup');
  }

  switchToSignin() {
    this.mode.set('signin');
  }
}