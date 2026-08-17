import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TreeNodeComponent } from './tree-node/tree-node.component';
import { HIERARCHY_TREE } from '../../features/documents/hierarchy.model';
import { DocumentStateService } from '../../features/documents/document-state.service';
import { IconField } from "primeng/iconfield";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [InputTextModule, TreeNodeComponent, IconField],
  templateUrl: './sidebar.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class SidebarComponent {
  state = inject(DocumentStateService);
  hierarchyTree = HIERARCHY_TREE;

  totalDocs = '2,847 docs';
  totalSize = '14.2 GB';
  version = 'v3.2.1';
}