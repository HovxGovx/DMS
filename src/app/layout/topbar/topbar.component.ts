import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ViewToggleComponent } from './view-toggle/view-toggle.component';
import { SearchDropdownComponent } from '../../features/search/search-dropdown/search-dropdown.component';
import { AdvancedSearchPanelComponent } from '../../features/search/advanced-search-panel/advanced-search-panel.component';
import { HierarchyStateService } from '../../features/documents/hierarchy-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    SearchDropdownComponent,
    AdvancedSearchPanelComponent,
    IconFieldModule,
    InputIconModule,
    UserMenuComponent,
    ViewToggleComponent
  ],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  hierarchyState = inject(HierarchyStateService);
}