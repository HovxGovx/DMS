import { HttpErrorResponse } from '@angular/common/http';
import { httpErrorMessage } from './http-error-message';

const failure = (status: number, message = 'This document was imported by a user outside your domains: 42') =>
  new HttpErrorResponse({ status, error: { message } });

describe('httpErrorMessage', () => {
  it("préfère le message de l'action pour ce statut", () => {
    expect(httpErrorMessage(failure(409), 'Échec.', { 409: 'Déjà publié.' })).toBe('Déjà publié.');
  });

  it('retombe sur le sens commun du statut', () => {
    expect(httpErrorMessage(failure(403), 'Échec.')).toBe('Vos droits ne permettent pas cette action.');
  });

  it('utilise le message par défaut pour une erreur serveur', () => {
    expect(httpErrorMessage(failure(500), 'Impossible de retirer le document.')).toBe('Impossible de retirer le document.');
  });

  it("n'affiche jamais le texte du backend", () => {
    expect(httpErrorMessage(failure(400), 'Dossier refusé.')).not.toContain('imported');
  });

  it('accepte une erreur qui ne vient pas de HttpClient', () => {
    expect(httpErrorMessage(new Error('boom'), 'Échec.')).toBe('Échec.');
  });
});
