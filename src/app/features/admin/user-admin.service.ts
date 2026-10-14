import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser } from './admin-user.model';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/users`;

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.baseUrl);
  }

  /** Remplace tous les domaines de l'utilisateur (liste vide : plus aucun domaine). */
  replaceDomains(id: string, domainCodes: string[]): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.baseUrl}/${id}/domains`, { domainCodes });
  }
}
