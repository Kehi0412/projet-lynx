import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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


@Injectable({ providedIn: 'root' })
export class PosteService {
  private http = inject(HttpClient);
  private readonly url =  'http://192.168.8.223:8080/api/postes'; // à adapter

  getAll(): Observable<Poste[]> {
    return this.http.get<Poste[]>(this.url);
  }

  getBySousFamille(sousFamilleId: number): Observable<Poste[]> {
    const params = new HttpParams().set('sousFamilleId', sousFamilleId);
    return this.http.get<Poste[]>(this.url, { params });
  }

  getById(id: number): Observable<Poste> {
    return this.http.get<Poste>(`${this.url}/${id}`);
  }

  create(poste: Poste): Observable<Poste> {
    return this.http.post<Poste>(this.url, poste);
  }

  update(id: number, poste: Poste): Observable<Poste> {
    return this.http.put<Poste>(`${this.url}/${id}`, poste);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

