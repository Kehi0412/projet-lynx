import { Injectable } from '@angular/core';
import { ParamKey } from './parametre.model';

@Injectable({ providedIn: 'root' })
export class ParametreService {
  private data: Record<ParamKey, any[]> = {
    annee: [{ id_ann: 1, lib_ann: '2026', thm_ann: 'Exercice 2026', supprimer: false }],
    categorie: [],
    typemission: [
      { id_typ: 1, lib_typ: 'Audit', supprimer: false },
      { id_typ: 2, lib_typ: 'Inspection', supprimer: false },
      { id_typ: 3, lib_typ: 'Mission', supprimer: false },
    ],
    agent: [], // ← à ajouter
    recommandation: [], // ← à ajouter
    fichier: [], // ← à ajouter
  };
  private user = 'admin';

  list(key: ParamKey) {
    return this.data[key].filter((x) => !x.supprimer);
  }

  save(key: ParamKey, idField: string, item: any) {
    const now = new Date().toISOString();
    if (item[idField]) {
      const i = this.data[key].findIndex((x) => x[idField] === item[idField]);
      this.data[key][i] = {
        ...this.data[key][i],
        ...item,
        modifier_par: this.user,
        modifier_le: now,
      };
    } else {
      const next = Math.max(0, ...this.data[key].map((x) => x[idField])) + 1;
      this.data[key].push({
        ...item,
        [idField]: next,
        creer_par: this.user,
        cree_le: now,
        supprimer: false,
      });
    }
  }

  remove(key: ParamKey, idField: string, id: number) {
    const it = this.data[key].find((x) => x[idField] === id);
    if (it) {
      it.supprimer = true;
      it.modifier_par = this.user;
      it.modifier_le = new Date().toISOString();
    }
  }
}
