import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SuggestedTag } from '../validation.model';

@Component({
  selector: 'app-tags-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tags-editor.component.html'
})
export class TagsEditorComponent {
  tags = model.required<SuggestedTag[]>();

  isAdding = signal(false);
  newTagLabel = signal('');

  accept(label: string) {
    this.updateStatus(label, 'accepted');
  }

  reject(label: string) {
    this.updateStatus(label, 'rejected');
  }

  private updateStatus(label: string, status: SuggestedTag['status']) {
    this.tags.update(list =>
      list.map(t => t.label === label ? { ...t, status } : t)
    );
  }

  startAdding() {
    this.isAdding.set(true);
  }

  confirmAdd() {
    const label = this.newTagLabel().trim();
    if (label) {
      this.tags.update(list => [...list, { label, status: 'accepted' }]);
    }
    this.newTagLabel.set('');
    this.isAdding.set(false);
  }

  cancelAdd() {
    this.newTagLabel.set('');
    this.isAdding.set(false);
  }
}