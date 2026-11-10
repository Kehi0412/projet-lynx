import { Injectable, inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../httpRequetteServices/api.service (1)';
import { catchError, map, Observable, throwError } from 'rxjs';

@Service()
export class Login {
  private apiService = inject(ApiService);

  login(data: any): Observable<any> {
    return this.apiService._post(`addTypeInformation`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // Méthode pour la liste des fonctions agents
  getAllTypeInfo(): Observable<any> {
    return this.apiService._get(`getAllTypeInformation`).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  // Méthode pour supprimer un membre
  deleteTypeInfo(id: any): Observable<any> {
    return this.apiService._delete('deleteTypeInformation/' + id).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }
  // Méthode pour modifier une focntion agent:
  updateTypeInfo(formData: any) {
    return this.apiService._put('updateTypeInformation', formData).pipe(
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
  _VerifierOtp(data: { matricule: string; code: string }) {
    return this.apiService._post(`/auth/verifier-otp`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }

  _Inscription(data: { nom: string; matricule: string; motDePasse: string }) {
    return this.apiService._post(`/auth/verifier-otp`, data).pipe(
      map((response: any) => response),
      catchError(this._handleError),
    );
  }
}

