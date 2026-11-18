import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../httpRequetteServices/api.service (1)';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TypePosteService {
  private apiService = inject(ApiService);
  private endpoint = 'api/type-postes';

  getAll(): Observable<any> {
    return this.apiService._get(this.endpoint).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  getById(id: any): Observable<any> {
    return this.apiService._get(`${this.endpoint}/${id}`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  create(data: any): Observable<any> {
    return this.apiService._post(this.endpoint, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  update(id: any, data: any): Observable<any> {
    return this.apiService._put(`${this.endpoint}/${id}`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  delete(id: any): Observable<any> {
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
    return throwError(errMsg);
  }

  getAllTypePostes(): Observable<any> {
    return this.getAll();
  }

  createTypePoste(data: any): Observable<any> {
    return this.create(data);
  }

  updateTypePoste(id: any, data: any): Observable<any> {
    return this.update(id, data);
  }

  deleteTypePoste(id: any): Observable<any> {
    return this.delete(id);
  }
}
