import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { SmartFolderApiService } from '../../smart-folder-api.service';
import {
  Criterion,
  CriterionFieldCode,
  CriterionFieldDefinition,
  CriterionOperator
} from '../../smart-folder.model';

interface CriterionRow {
  field: CriterionFieldCode | null;
  operator: CriterionOperator | null;
  value: string | null;
}

interface Option {
  label: string;
  value: string;
}

const OPERATOR_LABELS: Record<CriterionOperator, string> = {
  EQUALS: 'est égal à',
  CONTAINS: 'contient',
  IS_EMPTY: 'est vide'
};

const MAX_CRITERIA = 10;

@Component({
  selector: 'app-folder-editor-dialog',
  standalone: true,
  imports: [FormsModule, Dialog, Select, InputTextModule, ButtonModule, FloatLabel],
  templateUrl: './folder-editor-dialog.component.html'
})
export class FolderEditorDialogComponent implements OnInit {
  private api = inject(SmartFolderApiService);

  mode = input.required<'create' | 'edit'>();
  folderId = input<string | null>(null);
  parentId = input<string | null>(null);

  saved = output<string>();
  closed = output<void>();

  readonly maxCriteria = MAX_CRITERIA;

  visible = signal(true);
  isLoading = signal(true);
  isSaving = signal(false);
  error = signal<string | null>(null);

  name = signal('');
  rows = signal<CriterionRow[]>([]);
  inherited = signal<Criterion[]>([]);
  parentName = signal<string | null>(null);
  fields = signal<CriterionFieldDefinition[]>([]);

  title = computed(() => this.mode() === 'edit' ? 'Modifier le dossier' : 'Nouveau dossier');

  fieldOptions = computed<Option[]>(() =>
    this.fields().map(f => ({ label: f.label, value: f.field }))
  );

  ngOnInit() {
    this.api.getCriterionFields().subscribe({
      next: fields => {
        this.fields.set(fields);
        this.loadContext();
      },
      error: err => this.failLoading(err)
    });
  }

  addRow() {
    if (this.rows().length >= MAX_CRITERIA) return;
    this.rows.update(list => [...list, { field: null, operator: null, value: null }]);
  }

  removeRow(row: CriterionRow) {
    this.rows.update(list => list.filter(r => r !== row));
  }

  onFieldChange(row: CriterionRow, field: CriterionFieldCode | null) {
    const definition = this.definition(field);
    row.operator = definition?.operators[0] ?? null;
    row.value = null;
  }

  onOperatorChange(row: CriterionRow) {
    if (row.operator === 'IS_EMPTY') {
      row.value = null;
    }
  }

  operatorOptions(row: CriterionRow): Option[] {
    return (this.definition(row.field)?.operators ?? [])
      .map(operator => ({ label: OPERATOR_LABELS[operator], value: operator }));
  }

  valueOptions(row: CriterionRow): Option[] {
    return (this.definition(row.field)?.values ?? [])
      .map(option => ({ label: option.label, value: option.value }));
  }

  describe(criterion: Criterion): string {
    const definition = this.definition(criterion.field);
    const fieldLabel = definition?.label ?? criterion.field;
    const operatorLabel = OPERATOR_LABELS[criterion.operator];
    if (criterion.operator === 'IS_EMPTY') {
      return `${fieldLabel} ${operatorLabel}`;
    }
    const valueLabel = definition?.values.find(v => v.value === criterion.value)?.label ?? criterion.value;
    return `${fieldLabel} ${operatorLabel} ${valueLabel}`;
  }

  save() {
    const name = this.name().trim();
    if (!name) {
      this.error.set('Le nom du dossier est obligatoire.');
      return;
    }

    const criteria: Criterion[] = [];
    for (const row of this.rows()) {
      const value = row.operator === 'IS_EMPTY' ? null : (row.value ?? '').trim();
      if (!row.field || !row.operator || (row.operator !== 'IS_EMPTY' && !value)) {
        this.error.set('Complétez ou supprimez les critères vides.');
        return;
      }
      criteria.push({ field: row.field, operator: row.operator, value });
    }

    this.error.set(null);
    this.isSaving.set(true);

    const folderId = this.folderId();
    const request$ = this.mode() === 'edit' && folderId
      ? this.api.update(folderId, { name, criteria })
      : this.api.create({ parentId: this.parentId(), name, criteria });

    request$.subscribe({
      next: folder => {
        this.isSaving.set(false);
        this.saved.emit(folder.id);
      },
      error: err => {
        this.isSaving.set(false);
        this.error.set(err.error?.message ?? "Impossible d'enregistrer le dossier.");
      }
    });
  }

  cancel() {
    this.closed.emit();
  }

  private loadContext() {
    const folderId = this.folderId();
    const parentId = this.parentId();

    if (this.mode() === 'edit' && folderId) {
      this.api.getDetail(folderId).subscribe({
        next: detail => {
          this.name.set(detail.name);
          this.rows.set(detail.criteria.map(criterion => ({ ...criterion })));
          this.inherited.set(detail.inheritedCriteria);
          this.isLoading.set(false);
        },
        error: err => this.failLoading(err)
      });
    } else if (parentId) {
      this.api.getDetail(parentId).subscribe({
        next: parent => {
          this.parentName.set(parent.name);
          this.inherited.set([...parent.inheritedCriteria, ...parent.criteria]);
          this.isLoading.set(false);
        },
        error: err => this.failLoading(err)
      });
    } else {
      this.isLoading.set(false);
    }
  }

  private definition(field: CriterionFieldCode | null): CriterionFieldDefinition | undefined {
    return this.fields().find(f => f.field === field);
  }

  private failLoading(err: { error?: { message?: string } }) {
    this.isLoading.set(false);
    this.error.set(err.error?.message ?? 'Impossible de charger les données du dossier.');
  }
}