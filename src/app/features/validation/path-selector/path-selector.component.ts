import { Component, model, signal } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { HIERARCHY_TREE, HierarchyNode } from '../hierarchy-tree.data';

@Component({
  selector: 'app-path-selector',
  standalone: true,
  imports: [TreeModule],
  templateUrl: './path-selector.component.html'
})
export class PathSelectorComponent {
  path = model.required<string[]>();

  isEditing = signal(false);
  treeNodes = signal<TreeNode[]>(this.buildTreeNodes(HIERARCHY_TREE));

  toggleEdit() {
    this.isEditing.update(v => !v);
  }

  close() {
    this.isEditing.set(false);
  }

  selectNode(nodePath: string[]) {
    this.path.set(nodePath);
  }

  isSelected(nodePath: string[]): boolean {
    return JSON.stringify(nodePath) === JSON.stringify(this.path());
  }

  private buildTreeNodes(nodes: HierarchyNode[]): TreeNode[] {
    return nodes.map(n => ({
      key: n.key,
      label: n.label,
      data: { path: n.path },
      expanded: true,
      children: n.children ? this.buildTreeNodes(n.children) : undefined
    }));
  }
}