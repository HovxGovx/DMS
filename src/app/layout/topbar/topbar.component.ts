import { Component, inject } from '@angular/core';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ViewToggleComponent } from './view-toggle/view-toggle.component';
import { SearchDropdownComponent } from '../../features/search/search-dropdown/search-dropdown.component';
import { ViewStateService } from '../../core/view-state.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [SearchDropdownComponent,
    UserMenuComponent,
    ViewToggleComponent],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  viewState = inject(ViewStateService);
}
