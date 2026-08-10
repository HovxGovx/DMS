import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [InputTextModule, AvatarModule, IconFieldModule, InputIconModule],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  userName = 'Elena Marquez';
  userRole = 'System Admin';
  userInitials = 'EM';
}