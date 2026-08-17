import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [InputTextModule, IconFieldModule, InputIconModule, UserMenuComponent],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {}