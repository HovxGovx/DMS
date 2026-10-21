import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RagService } from './rag.service';
import { RagAnswer } from './rag.model';

/** Longueur maximale d'une question, même limite que le backend. */
export const MAX_QUESTION_LENGTH = 1000;

/**
 * Question en cours et dernière réponse, gardées hors du composant pour survivre à la fermeture du panneau.
 * Une réponse rédigée sur processeur prend 10 à 30 secondes : le temps écoulé est affiché pendant l'attente.
 */
@Injectable({ providedIn: 'root' })
export class RagStateService {
  private ragService = inject(RagService);
  private request?: Subscription;
  private timer?: ReturnType<typeof setInterval>;

  isOpen = signal(false);
  askedQuestion = signal<string | null>(null);
  answer = signal<RagAnswer | null>(null);
  isAsking = signal(false);
  elapsedSeconds = signal(0);
  error = signal<string | null>(null);
  /** Le backend répond sans source quand aucun document lisible ne contient la réponse. */
  notFound = computed(() => this.answer()?.sources.length === 0);

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.isOpen.set(true);
    }
  }

  close() {
    this.cancel();
    this.isOpen.set(false);
  }

  ask(question: string) {
    const text = question.trim();
    if (!text || text.length > MAX_QUESTION_LENGTH || this.isAsking()) return;

    this.askedQuestion.set(text);
    this.answer.set(null);
    this.error.set(null);
    this.isAsking.set(true);
    this.startTimer();

    this.request = this.ragService.ask(text).subscribe({
      next: answer => {
        this.answer.set(answer);
        this.finish();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(errorMessage(error));
        this.finish();
      }
    });
  }

  /** Abandonne la question en cours (fermeture du panneau) : la réponse arrivée ensuite serait ignorée. */
  private cancel() {
    this.request?.unsubscribe();
    if (this.isAsking()) {
      this.askedQuestion.set(null);
    }
    this.finish();
  }

  private startTimer() {
    this.elapsedSeconds.set(0);
    this.timer = setInterval(() => this.elapsedSeconds.update(seconds => seconds + 1), 1000);
  }

  private finish() {
    clearInterval(this.timer);
    this.isAsking.set(false);
  }
}

function errorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 503:
      return 'Le service de questions est momentanément indisponible. Réessayez dans quelques instants.';
    case 400:
      return `La question doit contenir entre 1 et ${MAX_QUESTION_LENGTH} caractères.`;
    default:
      return "Impossible d'obtenir une réponse.";
  }
}
