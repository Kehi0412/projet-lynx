import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiService } from '../../httpRequetteServices/api.service (1)';

export interface Famille {
  id?: number;
  codeFamille: string;
  libelleFamille: string;
  typeFamille: string;
  natureFamille: string;
  idSousFamille?: number;
  libelleSousFamille?: string;
}

@Injectable({ providedIn: 'root' })
export class FamilleService {
  private apiService = inject(ApiService);
  private endpoint = 'api/familles';

  getAll(): Observable<Famille[]> {
    return this.apiService._get(this.endpoint).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }
  getById(id: number): Observable<Famille> {
    return this.apiService._get(`${this.endpoint}/${id}`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  create(data: Famille): Observable<Famille> {
    return this.apiService._post(this.endpoint, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  update(id: number, data: Famille): Observable<Famille> {
    return this.apiService._put(`${this.endpoint}/${id}`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  delete(id: number): Observable<void> {
    return this.apiService._delete(`${this.endpoint}/${id}`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  private _handleError(error: any) {
    const errMsg = error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server error';
    return throwError(() => errMsg);
  }
}
