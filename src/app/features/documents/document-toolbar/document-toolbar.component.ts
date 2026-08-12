import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-document-toolbar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './document-toolbar.component.html'
})
export class DocumentToolbarComponent {
  viewMode = input<'list' | 'grid'>('list');

  viewModeChange = output<'list' | 'grid'>();
  sortClick = output<void>();
  newClick = output<void>();
}