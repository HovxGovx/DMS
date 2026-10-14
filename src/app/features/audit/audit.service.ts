import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditEntry, AuditFilter, AuditPage } from './audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);

  /** Historique d'un document (404 si l'utilisateur ne peut pas le lire). */
  getDocumentHistory(documentId: string): Observable<AuditEntry[]> {
    return this.http.get<AuditEntry[]>(`${environment.apiUrl}/api/dms/document/${documentId}/history`);
  }

  /** Journal complet (ADMIN). Les jours sont convertis en instants selon le fuseau du navigateur. */
  search(filter: AuditFilter, page: number, size: number): Observable<AuditPage> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filter.actorId) params = params.set('actorId', filter.actorId);
    if (filter.action) params = params.set('action', filter.action);
    if (filter.fromDay) params = params.set('from', startOfDay(filter.fromDay, 0));
    // Jour de fin inclus : la borne envoyée est le début du jour suivant (exclue)
    if (filter.toDay) params = params.set('to', startOfDay(filter.toDay, 1));
    return this.http.get<AuditPage>(`${environment.apiUrl}/api/dms/admin/audit`, { params });
  }
}

/** Début du jour local (yyyy-mm-dd), décalé de offsetDays, en ISO UTC. */
function startOfDay(day: string, offsetDays: number): string {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date + offsetDays).toISOString();
}
