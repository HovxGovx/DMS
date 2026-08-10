import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { IngestPanelComponent } from './features/upload/ingest-panel/ingest-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopbarComponent, IngestPanelComponent, RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {} 
