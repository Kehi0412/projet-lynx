import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../httpRequetteServices/api.service (1)';
import { Observable, catchError, throwError } from 'rxjs';

export interface SousFamille {
  id?: number;
  codeSousFamille: string;
  libelleSousFamille: string;
  typeSousFamille?: string;
}

@Injectable({ providedIn: 'root' })
export class SousFamilleService {
  private apiService = inject(ApiService);
  private endpoint = 'api/sous-familles';

  getAll(): Observable<SousFamille[]> {
    return this.apiService._get(this.endpoint).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<SousFamille> {
    return this.apiService._get(`${this.endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: SousFamille): Observable<any> {
    return this.apiService._post(this.endpoint, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: SousFamille): Observable<any> {
    return this.apiService._put(`${this.endpoint}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.apiService._delete(`${this.endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const message =
      error.error?.message || error.message || `${error.status} - ${error.statusText}`;

    return throwError(() => new Error(message));
  }
}
