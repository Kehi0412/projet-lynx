import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../httpRequetteServices/api.service (1)';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Poste {
  id?: number;
  codePoste: string;
  libelleCourt: string;
  libelleLong: string;
  matriculeResponsable: string;
  typePosteId: number;
  typePosteLibelle?: string;
  processusId: number;
  processusLibelle?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PosteService {
  private apiService = inject(ApiService);

  private endpoint = 'api/postes';

  // Récupérer tous les postes
  getAll(): Observable<any> {
    return this.apiService._get(this.endpoint).pipe(
      map((res: any) => res),
      catchError((error: any) => {
        console.error('Erreur lors du chargement des postes :', error);
        throw error;
      }),
    );
  }

  // Récupérer un poste par son ID
  getById(id: number): Observable<any> {
    return this.apiService._get(`${this.endpoint}/${id}`).pipe(
      map((res: any) => res),
      catchError((error: any) => {
        console.error('Erreur lors de la récupération du poste :', error);
        throw error;
      }),
    );
  }

  // Ajouter un poste
  create(poste: Poste): Observable<any> {
    return this.apiService._post(this.endpoint, poste).pipe(
      map((res: any) => res),
      catchError((error: any) => {
        console.error('Erreur lors de la création du poste :', error);
        throw error;
      }),
    );
  }

  // Modifier un poste
  update(id: number, poste: Poste): Observable<any> {
    return this.apiService._put(`${this.endpoint}/${id}`, poste).pipe(
      map((res: any) => res),
      catchError((error: any) => {
        console.error('Erreur lors de la modification du poste :', error);
        throw error;
      }),
    );
  }

  // Supprimer un poste
  delete(id: number): Observable<any> {
    return this.apiService._delete(`${this.endpoint}/${id}`).pipe(
      map((res: any) => res),
      catchError((error: any) => {
        console.error('Erreur lors de la suppression du poste :', error);
        throw error;
      }),
    );
  }
}
