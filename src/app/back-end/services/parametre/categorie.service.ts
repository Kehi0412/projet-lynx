import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../httpRequetteServices/api.service (1)';
import { Observable, catchError, throwError } from 'rxjs';

export interface Categorie {
  id?: number;
  nom: string;
  type?: string;
  idTypeMission: number;
  codeTyMission?: string;
}

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private apiService = inject(ApiService);
  private endpoint = 'api/categories';

  getAll(): Observable<Categorie[]> {
    return this.apiService._get(this.endpoint).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Categorie> {
    return this.apiService._get(`${this.endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: Categorie): Observable<any> {
    return this.apiService._post(this.endpoint, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Categorie): Observable<any> {
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
