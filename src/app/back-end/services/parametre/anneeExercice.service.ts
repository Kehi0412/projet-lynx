import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../httpRequetteServices/api.service (1)';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnneeExerciceService {
  private apiService = inject(ApiService);

  // GET /api/annees
  getAllAnnees(): Observable<any> {
    return this.apiService._get(`api/annees`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // GET /api/annees/{id}
  getAnneeById(id: any): Observable<any> {
    return this.apiService._get(`api/annees/${id}`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // POST /api/annees
  createAnnee(data: any): Observable<any> {
    return this.apiService._post(`api/annees`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // PUT /api/annees/{id}
  updateAnnee(id: any, data: any): Observable<any> {
    return this.apiService._put(`api/annees/${id}`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // DELETE /api/annees/{id}
  deleteAnnee(id: any): Observable<any> {
    return this.apiService._delete(`api/annees/${id}`).pipe(
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
    return throwError(errMsg);
  }
}
