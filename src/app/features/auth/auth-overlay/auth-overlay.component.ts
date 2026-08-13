import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-auth-overlay',
  standalone: true,
  templateUrl: './auth-overlay.component.html',
  styleUrl: './auth-overlay.component.css'
})
export class AuthOverlayComponent {
  mode = input.required<'signin' | 'signup'>();

  switchToSignup = output<void>();
  switchToSignin = output<void>();
}