import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [FormsModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './signup-form.component.html'
})
export class SignupFormComponent {
  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  onSubmit() {
    console.log('Inscription :', this.fullName(), this.email());
  }
}