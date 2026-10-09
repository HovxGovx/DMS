export interface HierarchyNode {
  key: string;
  label: string;
  icon: string;
  type: 'folder' | 'leaf';
  path: string[];
  filesKey?: string; // uniquement pour les leaf
  children?: HierarchyNode[];
  count?: number;
  hasChildren?: boolean;
  editable?: boolean;
  parentId?: string | null;
}

export type NodeAction = 'create' | 'edit' | 'delete';

export interface NodeActionEvent {
  node: HierarchyNode;
  action: NodeAction;
}