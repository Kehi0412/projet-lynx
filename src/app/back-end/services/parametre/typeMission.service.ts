import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../httpRequetteServices/api.service (1)';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TypeMissionService {
  private apiService = inject(ApiService);

  // GET /api/type-missions
  getAllTypeMissions(): Observable<any> {
    return this.apiService._get(`api/type-missions`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // POST /api/type-missions
  createTypeMission(data: any): Observable<any> {
    return this.apiService._post(`api/type-missions`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // PUT /api/type-missions/{id}
  updateTypeMission(id: any, data: any): Observable<any> {
    return this.apiService._put(`api/type-missions/${id}`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // DELETE /api/type-missions/{id}
  deleteTypeMission(id: any): Observable<any> {
    return this.apiService._delete(`api/type-missions/${id}`).pipe(
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
