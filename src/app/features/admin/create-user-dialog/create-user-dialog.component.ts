import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { UserAdminService } from '../user-admin.service';
import { AdminUser, ROLE_LABELS } from '../admin-user.model';
import { SelectOption } from '../../validation/classification-select/classification-select.component';
import { Role } from '../../../core/auth.service';

// Mêmes règles que DefaultUserAccountService côté backend
const UID_PATTERN = /^[a-z][a-z0-9._-]{1,31}$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_NAME_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const GENERATED_PASSWORD_LENGTH = 14;
// Sans caractères faciles à confondre (0/O, 1/l/I) : le mot de passe est souvent dicté ou recopié
const PASSWORD_ALPHABET = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_.!';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [FormsModule, Dialog, Select, MultiSelect, InputTextModule, ButtonModule, FloatLabel],
  templateUrl: './create-user-dialog.component.html'
})
export class CreateUserDialogComponent {
  private userAdminService = inject(UserAdminService);

  domainOptions = input.required<SelectOption[]>();

  created = output<AdminUser>();
  closed = output<void>();

  readonly roleOptions = (Object.keys(ROLE_LABELS) as Role[]).map(role => ({ label: ROLE_LABELS[role], value: role }));

  visible = signal(true);
  isSaving = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  copied = signal(false);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  uid = signal('');
  /** Tant que l'admin n'y touche pas, l'identifiant suit le prénom et le nom. */
  private uidEdited = signal(false);
  password = signal('');
  role = signal<Role>('CONTRIBUTOR');
  domainCodes = signal<string[]>([]);

  isAdminRole = computed(() => this.role() === 'ADMIN');

  onFirstNameChange(value: string) {
    this.firstName.set(value);
    this.suggestUid();
  }

  onLastNameChange(value: string) {
    this.lastName.set(value);
    this.suggestUid();
  }

  onUidChange(value: string) {
    this.uid.set(value);
    this.uidEdited.set(value.trim() !== '');
  }

  onPasswordChange(value: string) {
    this.password.set(value);
    this.copied.set(false);
  }

  generatePassword() {
    const bytes = crypto.getRandomValues(new Uint8Array(GENERATED_PASSWORD_LENGTH));
    this.onPasswordChange(Array.from(bytes, b => PASSWORD_ALPHABET[b % PASSWORD_ALPHABET.length]).join(''));
    this.showPassword.set(true);
  }

  copyPassword() {
    navigator.clipboard.writeText(this.password()).then(
      () => this.copied.set(true),
      () => this.error.set('Copie impossible : sélectionnez le mot de passe à la main.')
    );
  }

  save() {
    const firstName = this.firstName().trim();
    const lastName = this.lastName().trim();
    const uid = this.uid().trim();
    const email = this.email().trim();
    const password = this.password();

    const invalid = validate(firstName, lastName, uid, email, password);
    if (invalid) {
      this.error.set(invalid);
      return;
    }

    this.error.set(null);
    this.isSaving.set(true);
    this.userAdminService.createUser({
      uid,
      firstName,
      lastName,
      email,
      password,
      role: this.role(),
      // Un administrateur voit tous les domaines : ses domaines ne comptent pas
      domainCodes: this.isAdminRole() ? [] : this.domainCodes()
    }).subscribe({
      next: user => {
        this.isSaving.set(false);
        this.created.emit(user);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.error.set(errorMessage(err, uid));
      }
    });
  }

  cancel() {
    this.closed.emit();
  }

  private suggestUid() {
    if (!this.uidEdited()) {
      this.uid.set(suggestUid(this.firstName(), this.lastName()));
    }
  }
}

/** Initiale du prénom + nom, sans accents ni espaces (« Hery Rabe » → « hrabe »), comme les comptes existants. */
function suggestUid(firstName: string, lastName: string): string {
  const clean = (value: string) => value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return (clean(firstName).charAt(0) + clean(lastName)).slice(0, 32);
}

function validate(firstName: string, lastName: string, uid: string, email: string, password: string): string | null {
  if (!firstName || !lastName) return 'Le prénom et le nom sont obligatoires.';
  if (firstName.length > MAX_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) {
    return `Le prénom et le nom font au plus ${MAX_NAME_LENGTH} caractères.`;
  }
  if (!UID_PATTERN.test(uid)) {
    return 'Identifiant invalide : 2 à 32 caractères, commence par une lettre minuscule, puis lettres minuscules, chiffres, « . », « _ » ou « - ».';
  }
  if (!EMAIL_PATTERN.test(email)) return 'Adresse email invalide.';
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir entre ${MIN_PASSWORD_LENGTH} et ${MAX_PASSWORD_LENGTH} caractères.`;
  }
  return null;
}

function errorMessage(err: HttpErrorResponse, uid: string): string {
  switch (err.status) {
    case 409: return `L'identifiant « ${uid} » est déjà utilisé.`;
    case 503: return "L'annuaire LDAP est injoignable. Réessayez plus tard.";
    case 500: return "L'annuaire LDAP a refusé la création du compte.";
    case 403: return 'Action réservée aux administrateurs.';
    default: return err.error?.message ?? 'Impossible de créer le compte.';
  }
}
