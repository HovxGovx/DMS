import { Component, input, output } from '@angular/core';
import { HierarchyNode } from '../../../features/documents/hierarchy.model';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [TreeNodeComponent],
  templateUrl: './tree-node.component.html'
})
export class TreeNodeComponent {
  node = input.required<HierarchyNode>();
  depth = input<number>(0);

  // Fonctions fournies par le parent — pas de service injecté ici, le composant reste "bête"
  isExpandedFn = input.required<(key: string) => boolean>();
  isActiveFn = input.required<(node: HierarchyNode) => boolean>();
  getCountFn = input<((filesKey: string) => number) | null>(null);

  // true = n'importe quel nœud (dossier ou feuille) est sélectionnable au clic (cas validation)
  // false = seules les feuilles sont sélectionnables, un dossier se déplie juste (cas sidebar)
  selectAnyNode = input<boolean>(false);

  toggleExpand = output<string>();
  nodeSelect = output<HierarchyNode>();

  get isExpanded(): boolean {
    return this.isExpandedFn()(this.node().key);
  }

  get isActive(): boolean {
    return this.isActiveFn()(this.node());
  }

  get count(): number | null {
    const n = this.node();
    const fn = this.getCountFn();
    return n.type === 'leaf' && n.filesKey && fn ? fn(n.filesKey) : null;
  }

  onRowClick() {
    const n = this.node();
    if (this.selectAnyNode() || n.type === 'leaf') {
      this.nodeSelect.emit(n);
    } else {
      this.toggleExpand.emit(n.key);
    }
  }

  onChevronClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleExpand.emit(this.node().key);
  }
}