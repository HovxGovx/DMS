import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataField } from '../validation.model';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-metadata-form',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './metadata-form.component.html'
})
export class MetadataFormComponent {
  fields = model.required<MetadataField[]>();

  updateField(key: string, newValue: string) {
    this.fields.update(list =>
      list.map(f => f.key === key ? { ...f, value: newValue } : f)
    );
  }
}