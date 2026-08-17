export interface HierarchyNode {
  key: string;
  label: string;
  icon: string;
  type: 'folder' | 'leaf';
  path: string[];
  filesKey?: string; // uniquement pour les leaf
  children?: HierarchyNode[];
}

export const HIERARCHY_TREE: HierarchyNode[] = [
  {
    key: 'corporate', label: 'Corporate', icon: 'pi pi-building', type: 'folder',
    path: ['Corporate'],
    children: [
      {
        key: 'departments', label: 'Departments', icon: 'pi pi-folder', type: 'folder',
        path: ['Corporate', 'Departments'],
        children: [
          {
            key: 'finance', label: 'Finance', icon: 'pi pi-wallet', type: 'folder',
            path: ['Corporate', 'Departments', 'Finance'],
            children: [
              { key: 'invoices', label: 'Invoices', icon: 'pi pi-folder', type: 'leaf', filesKey: 'finance_invoices', path: ['Corporate', 'Departments', 'Finance', 'Invoices'] },
              { key: 'reports', label: 'Reports', icon: 'pi pi-folder', type: 'leaf', filesKey: 'finance_reports', path: ['Corporate', 'Departments', 'Finance', 'Reports'] },
              { key: 'budgets', label: 'Budgets', icon: 'pi pi-folder', type: 'leaf', filesKey: 'finance_budgets', path: ['Corporate', 'Departments', 'Finance', 'Budgets'] }
            ]
          },
          { key: 'legal', label: 'Legal', icon: 'pi pi-book', type: 'leaf', filesKey: 'legal_contracts', path: ['Corporate', 'Departments', 'Legal'] },
          { key: 'hr', label: 'HR', icon: 'pi pi-users', type: 'leaf', filesKey: 'hr_policies', path: ['Corporate', 'Departments', 'HR'] },
          { key: 'operations', label: 'Operations', icon: 'pi pi-cog', type: 'leaf', filesKey: 'operations', path: ['Corporate', 'Departments', 'Operations'] }
        ]
      },
      { key: 'clients', label: 'Clients', icon: 'pi pi-briefcase', type: 'leaf', filesKey: 'client_acme', path: ['Corporate', 'Clients'] },
      {
        key: 'projects', label: 'Projects', icon: 'pi pi-folder', type: 'folder',
        path: ['Corporate', 'Projects'],
        children: [
          { key: 'atlas', label: 'Atlas Migration', icon: 'pi pi-folder', type: 'leaf', filesKey: 'atlas_migration', path: ['Corporate', 'Projects', 'Atlas Migration'] },
          { key: 'phoenix', label: 'Phoenix Launch', icon: 'pi pi-folder', type: 'leaf', filesKey: 'phoenix_launch', path: ['Corporate', 'Projects', 'Phoenix Launch'] }
        ]
      }
    ]
  }
];