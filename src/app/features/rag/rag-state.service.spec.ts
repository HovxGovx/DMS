import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { RagStateService } from './rag-state.service';

const ASK_URL = '/api/dms/rag/ask';

describe('RagStateService', () => {
  let service: RagStateService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(RagStateService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envoie la question nettoyée et garde la réponse avec ses sources', () => {
    service.ask('  Quel budget ?  ');
    expect(service.isAsking()).toBeTrue();

    const request = http.expectOne(ASK_URL);
    expect(request.request.body).toEqual({ question: 'Quel budget ?' });
    request.flush({ answer: '10 000', sources: [{ documentId: 'd1', title: 'Rapport', distance: 0.4 }] });

    expect(service.isAsking()).toBeFalse();
    expect(service.askedQuestion()).toBe('Quel budget ?');
    expect(service.answer()?.answer).toBe('10 000');
    expect(service.notFound()).toBeFalse();
  });

  it('signale « pas trouvé » quand la réponse n’a aucune source', () => {
    service.ask('Pizza ?');
    http.expectOne(ASK_URL).flush({ answer: "Je n'ai pas trouvé…", sources: [] });

    expect(service.notFound()).toBeTrue();
  });

  it('affiche un message clair quand le service est indisponible (503)', () => {
    service.ask('Quel budget ?');
    http.expectOne(ASK_URL).flush({ code: 'RAG_UNAVAILABLE' }, { status: 503, statusText: 'Service Unavailable' });

    expect(service.error()).toContain('indisponible');
    expect(service.isAsking()).toBeFalse();
  });

  it('n’envoie rien pour une question vide', () => {
    service.ask('   ');

    http.expectNone(ASK_URL);
    expect(service.isAsking()).toBeFalse();
  });

  it('abandonne la question en cours à la fermeture du panneau', () => {
    service.isOpen.set(true);
    service.ask('Quel budget ?');
    const request = http.expectOne(ASK_URL);

    service.close();

    expect(request.cancelled).toBeTrue();
    expect(service.isOpen()).toBeFalse();
    expect(service.isAsking()).toBeFalse();
  });
});
