import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environement/environment';
import { Observable } from 'rxjs';
import {StorageService} from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private urlRessource = environment.urlServerApi;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  // 🔐 Génère dynamiquement les options avec headers + params
  private buildOptions(params?: any, customHeaders?: HttpHeaders): any {
    const userData = this.storage.getItem('userData');

    let headers = customHeaders || new HttpHeaders();
    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (userData) {
      try {
        const tokenObj = JSON.parse(userData);
        // Supposons que le token est dans une propriété 'token'
        const userToken = tokenObj.token; // Adaptez ceci selon la structure réelle
        if (userToken) {
          headers = headers.set('Authorization', `Bearer ${userToken}`);
        }
      } catch (e) {
        console.error('Error parsing userData', e);
      }
    }

    const options: any = { headers };

    if (params) {
      options.params = new HttpParams({ fromObject: params });
    }

    return options;
  }

  // 📥 GET
  _get(endpoint: string, params?: any, customHeaders?: HttpHeaders): Observable<any> {
    const options = this.buildOptions(params, customHeaders);
    return this.http.get(`${this.urlRessource}/${endpoint}`, options);
  }

  // 📤 POST
  _post(endpoint: string, body: any, params?: any, customHeaders?: HttpHeaders): Observable<any> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const options = this.buildOptions(params, isFormData ? undefined : customHeaders);
    if (isFormData) {
      // Remove Content-Type so the browser sets it with multipart boundary
      const { headers, ...rest } = options;
      const filteredHeaders = (headers as HttpHeaders).delete('Content-Type');
      const tokenObj = this.storage.getItem('userData');
      let authHeaders = new HttpHeaders();
      if (tokenObj) {
        try { authHeaders = authHeaders.set('Authorization', `Bearer ${JSON.parse(tokenObj).token}`); } catch {}
      }
      return this.http.post(`${this.urlRessource}/${endpoint}`, body, { headers: authHeaders, ...rest });
    }
    return this.http.post(`${this.urlRessource}/${endpoint}`, body, options);
  }

  // 🔁 PUT
  _put(endpoint: string, body: any, params?: any, customHeaders?: HttpHeaders): Observable<any> {
    const options = this.buildOptions(params, customHeaders);
    return this.http.put(`${this.urlRessource}/${endpoint}`, body, options);
  }

  // ❌ DELETE
  _delete(endpoint: string, body?: any, params?: any, customHeaders?: HttpHeaders): Observable<any> {
    const options = this.buildOptions(params, customHeaders);
    if (body) {
      options.body = body;
    }
    return this.http.delete(`${this.urlRessource}/${endpoint}`, options);
  }
}
