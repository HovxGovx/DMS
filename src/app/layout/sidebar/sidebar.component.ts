import { Component, signal } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from "primeng/iconfield";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TreeModule, InputTextModule, IconField],
  templateUrl: './sidebar.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class SidebarComponent {
  totalDocs = '2,847 docs';
  totalSize = '14.2 GB';
  version = 'v3.2.1';

  nodes = signal<TreeNode[]>([
    {
      key: 'corporate',
      label: 'Corporate',
      icon: 'pi pi-folder',
      data: { count: 13 },
      expanded: true,
      children: [
        {
          key: 'departments',
          label: 'Departments',
          icon: 'pi pi-folder',
          data: { count: 8 },
          expanded: true,
          children: [
            {
              key: 'finance',
              label: 'Finance',
              icon: 'pi pi-folder',
              data: { count: 3 },
              expanded: true,
              children: [
                { key: 'invoices', label: 'Invoices', icon: 'pi pi-folder', data: { count: 8 } },
                { key: 'reports', label: 'Reports', icon: 'pi pi-folder', data: { count: 3, active: true } },
                { key: 'budgets', label: 'Budgets', icon: 'pi pi-folder', data: { count: 2 } }
              ]
            },
            {
              key: 'legal',
              label: 'Legal',
              icon: 'pi pi-folder',
              data: { count: 2 },
              leaf: false,
              children: []
            },
            {
              key: 'hr',
              label: 'HR',
              icon: 'pi pi-folder',
              data: { count: 2 },
              leaf: false,
              children: []
            },
            {
              key: 'operations',
              label: 'Operations',
              icon: 'pi pi-folder',
              data: { count: 1 },
              leaf: true
            }
          ]
        },
        {
          key: 'clients',
          label: 'Clients',
          icon: 'pi pi-folder',
          data: { count: 3 },
          leaf: false,
          children: []
        },
        {
          key: 'projects',
          label: 'Projects',
          icon: 'pi pi-folder',
          data: { count: 2 },
          expanded: true,
          children: [
            { key: 'atlas', label: 'Atlas Migration', icon: 'pi pi-folder', data: { count: 2 } },
            { key: 'phoenix', label: 'Phoenix Launch', icon: 'pi pi-folder', data: { count: 1 } }
          ]
        }
      ]
    }
  ]);
}
