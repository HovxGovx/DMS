import { Component, input, inject } from '@angular/core';
import { HierarchyNode } from '../../../features/documents/hierarchy.model';
import { DocumentStateService } from '../../../features/documents/document-state.service';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [TreeNodeComponent],
  templateUrl: './tree-node.component.html'
})
export class TreeNodeComponent {
  node = input.required<HierarchyNode>();
  depth = input<number>(0);

  state = inject(DocumentStateService);

  get isExpanded(): boolean {
    return this.state.isExpanded(this.node().key);
  }

  get isActive(): boolean {
    const n = this.node();
    return n.type === 'leaf' && this.state.currentFilesKey() === n.filesKey;
  }

  get count(): number | null {
    const n = this.node();
    return n.type === 'leaf' && n.filesKey ? this.state.getCount(n.filesKey) : null;
  }

  onClick() {
    const n = this.node();
    if (n.type === 'leaf' && n.filesKey) {
      this.state.navigateTo(n.path, n.filesKey);
    } else {
      this.state.toggleExpand(n.key);
    }
  }
}