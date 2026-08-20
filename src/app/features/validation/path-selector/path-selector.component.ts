import { Component, model, signal } from '@angular/core';
import { TreeNodeComponent } from '../../../layout/sidebar/tree-node/tree-node.component';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { HIERARCHY_TREE, HierarchyNode } from '../../documents/hierarchy.model';

@Component({
  selector: 'app-path-selector',
  standalone: true,
  imports: [TreeNodeComponent, BreadcrumbComponent],
  templateUrl: './path-selector.component.html'
})
export class PathSelectorComponent {
  path = model.required<string[]>();

  isEditing = signal(false);
  tree = HIERARCHY_TREE;

  // État d'expansion local à ce composant — indépendant de celui du sidebar
  private expandedKeys = signal<Set<string>>(new Set(['corporate', 'departments']));

  isExpanded = (key: string) => this.expandedKeys().has(key);

  isActive = (node: HierarchyNode) =>
    JSON.stringify(node.path) === JSON.stringify(this.path());

  toggle() {
    this.isEditing.update(v => !v);
  }

  close() {
    this.isEditing.set(false);
  }

  onToggleExpand(key: string) {
    this.expandedKeys.update(set => {
      const next = new Set(set);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  onNodeSelect(node: HierarchyNode) {
    this.path.set(node.path);
  }
}