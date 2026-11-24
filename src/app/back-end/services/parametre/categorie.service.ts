import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categorie

{"id": 0,
  "nom": "string",
  "type": "string",
  "idTypeMission": 0,
  "codeTyMission": "string",
}

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private http = inject(HttpClient);
  private readonly url = '/api/categorie'; // à adapter

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.url);
  }

  getById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.url}/${id}`);
  }

  create(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.url, categorie);
  }

  update(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.url}/${id}`, categorie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
