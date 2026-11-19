import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiService } from '../../httpRequetteServices/api.service (1)';

export interface Recommandation {
  id?: number;
  libelleRecommandation: string;
  constatRecommandation: string;
  causeConstatRecommandation: string;
  dateDebutRecommandation: string;
  dateFinRecommandation: string;
  objectifRecommandation: string;
  preuveAttendueRecommandation: string;
  idSousFamille: number;
  libelleSousFamille?: string;
  idMission: number;
  codeMission?: string;
}

@Injectable({ providedIn: 'root' })
export class RecomandationService {
  private apiService = inject(ApiService);
  private endpoint = 'api/recommandations';

  getAll(): Observable<Recommandation[]> {
    return this.apiService._get(this.endpoint).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  getById(id: number): Observable<Recommandation> {
    return this.apiService._get(`${this.endpoint}/${id}`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  create(data: Recommandation): Observable<Recommandation> {
    return this.apiService._post(this.endpoint, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  update(id: number, data: Recommandation): Observable<Recommandation> {
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