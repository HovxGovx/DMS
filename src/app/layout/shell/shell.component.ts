import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { IngestPanelComponent } from '../../features/upload/ingest-panel/ingest-panel.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent, IngestPanelComponent, SidebarComponent],
  templateUrl: './shell.component.html'
})
export class ShellComponent {}