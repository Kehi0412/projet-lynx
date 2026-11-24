import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SousFamille {
  id: 0;
  codeSousFamille: 'string';
  libelleSousFamille: 'string';
  typeSousFamille: 'string';
}

@Injectable({ providedIn: 'root' })
export class SousFamilleService {
  private http = inject(HttpClient);
  private readonly url = 'api/sous-familles';

  getAll(): Observable<SousFamille[]> {
    return this.http.get<SousFamille[]>(this.url);
  }

  getById(id: number): Observable<SousFamille> {
    return this.http.get<SousFamille>(`${this.url}/${id}`);
  }

  create(sousFamille: SousFamille): Observable<SousFamille> {
    return this.http.post<SousFamille>(this.url, sousFamille);
  }

  update(id: number, sousFamille: SousFamille): Observable<SousFamille> {
    return this.http.put<SousFamille>(`${this.url}/${id}`, sousFamille);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
