export interface HierarchyNode {
  key: string;
  label: string;
  path: string[]; // chemin complet depuis la racine
  children?: HierarchyNode[];
}

export const HIERARCHY_TREE: HierarchyNode[] = [
  {
    key: 'rh', label: 'RH', path: ['RH'],
    children: [
      {
        key: 'note', label: 'Note', path: ['RH', 'Note'],
        children: [
          { key: 'commu', label: 'Commu', path: ['RH', 'Note', 'Commu'] },
          { key: 'officiel', label: 'Officiel', path: ['RH', 'Note', 'Officiel'] },
          { key: 'brouillon', label: 'Brouillon', path: ['RH', 'Note', 'Brouillon'] }
        ]
      }
    ]
  },
  {
    key: 'corporate', label: 'Corporate', path: ['Corporate'],
    children: [
      {
        key: 'finance', label: 'Finance', path: ['Corporate', 'Finance'],
        children: [
          { key: 'invoices', label: 'Invoices', path: ['Corporate', 'Finance', 'Invoices'] },
          { key: 'budgets', label: 'Budgets', path: ['Corporate', 'Finance', 'Budgets'] }
        ]
      },
      {
        key: 'legal', label: 'Legal', path: ['Corporate', 'Legal'],
        children: [
          { key: 'contracts', label: 'Contracts', path: ['Corporate', 'Legal', 'Contracts'] }
        ]
      }
    ]
  }
];