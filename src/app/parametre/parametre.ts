import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Champ {
  cle: string;
  label: string;
  type?: 'text' | 'date' | 'textarea' | 'select';
  source?: string; // pour 'select' : paramètre qui fournit les options
  requis?: boolean;
  pleine?: boolean;
}

interface Param {
  id: string;
  label: string;
  champs: Champ[];
  statut?: boolean; // gère la notion « en cours » (année d'exercice)
}

type Ligne = Record<string, any>;

const PARAMS: Param[] = [
  {
    // entité annee : Lib_ann, Thm_ann
    id: 'annee',
    label: "Année d'exercice",
    statut: true,
    champs: [
      { cle: 'Lib_ann', label: 'Libellé', requis: true },
      { cle: 'Thm_ann', label: 'Thème', requis: true },
    ],
  },
  {
    // pas d'entité dédiée dans le MCD : on utilise Cate_miss de type_mission
    id: 'categorie',
    label: 'Catégorie',
    champs: [{ cle: 'Cate_miss', label: 'Catégorie de mission', requis: true, pleine: true }],
  },
  {
    // entité type_mission : Cod_t_miss, Cate_miss
    id: 'type',
    label: 'Type de mission',
    champs: [
      { cle: 'Cod_t_miss', label: 'Code type de mission', requis: true },
      { cle: 'Cate_miss', label: 'Catégorie de mission', requis: true },
    ],
  },
  {
    // entité agent : Cod_miss, D_db_miss, D_fin_miss
    id: 'agent',
    label: 'Agent',
    champs: [
      { cle: 'Cod_miss', label: 'Code', requis: true, pleine: true },
      { cle: 'D_db_miss', label: 'Date de début', type: 'date', requis: true },
      { cle: 'D_fin_miss', label: 'Date de fin', type: 'date', requis: true },
    ],
  },
  {
    // entité recommandation
    id: 'recommandation',
    label: 'Recommandation',
    champs: [
      { cle: 'Lib_rec', label: 'Libellé', requis: true, pleine: true },
      { cle: 'Const_rec', label: 'Constat', type: 'textarea', requis: true, pleine: true },
      { cle: 'Cse_const_rec', label: 'Cause du constat', type: 'textarea', pleine: true },
      { cle: 'D_db_rec', label: 'Date de début', type: 'date', requis: true },
      { cle: 'D_fin_rec', label: 'Date de fin', type: 'date', requis: true },
      { cle: 'Ob_rec', label: 'Observation', type: 'textarea', pleine: true },
      { cle: 'Pr_att_rec', label: 'Pr_att_rec', pleine: true },
    ],
  },
  {
    // entité famille : Cod_fam, Lib_fam, Typ_fam, Nat_fam
    id: 'famille',
    label: 'Famille',
    champs: [
      { cle: 'Cod_fam', label: 'Code', requis: true },
      { cle: 'Lib_fam', label: 'Libellé', requis: true },
      { cle: 'Typ_fam', label: 'Type', requis: true },
      { cle: 'Nat_fam', label: 'Nature', requis: true },
    ],
  },
  {
    // entité sous famille : Cod_sf, Lib_sf, Typ_sf + lien vers famille (1,1)
    id: 'sousfamille',
    label: 'Sous-famille',
    champs: [
      { cle: 'Cod_sf', label: 'Code', requis: true },
      { cle: 'Lib_sf', label: 'Libellé', requis: true },
      { cle: 'Typ_sf', label: 'Type', requis: true },
      { cle: 'id_fam', label: 'Famille', type: 'select', source: 'famille', requis: true },
    ],
  },
];

@Component({
  selector: 'app-parametre',
  imports: [ReactiveFormsModule],
  templateUrl: './parametre.html',
  styleUrl: './parametre.css',
})
export class Parametre {
  private fb = inject(FormBuilder);

  params = PARAMS;
  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  modalOuvert = signal(false);

  actifId = signal('annee');
  actif = computed(() => this.params.find(p => p.id === this.actifId())!);

  donnees = signal<Record<string, Ligne[]>>({
    annee: [
      { id: 1, Lib_ann: '2026', Thm_ann: 'Exercice 2026', enCours: false },
      { id: 2, Lib_ann: '2027', Thm_ann: 'Exercice 2027', enCours: true },
      { id: 3, lib_ann:'2028' ,Thm_ann:'Exercice 2028', enCours:true }
    ],
    categorie: [],
    type: [],
    agent: [],
    recommandation: [],
    famille: [],
    sousfamille: [],
  });
  lignes = computed(() => this.donnees()[this.actifId()] ?? []);
  anneeEnCours = computed(() => this.donnees()['annee'].find(l => l['enCours']));

  form: FormGroup = this.fb.group({});

  // Colonne affichée pour chaque liste déroulante liée
  libelleCle: Record<string, string> = { famille: 'Lib_fam' };

  typeDe(c: Champ): string {
    return c.type ?? 'text';
  }

  options(source: string) {
    return this.donnees()[source] ?? [];
  }

  libelle(source: string, id: any) {
    const l = this.options(source).find(x => x['id'] == id);
    return l ? l[this.libelleCle[source]] : '-';
  }

  choisir(id: string) {
    this.actifId.set(id);
  }

  ouvrir() {
    const p = this.actif();
    const controles: Record<string, any> = {};
    for (const c of p.champs) {
      controles[c.cle] = ['', c.requis ? Validators.required : []];
    }
    if (p.statut) controles['enCours'] = [false];
    this.form = this.fb.group(controles);
    this.modalOuvert.set(true);
    this.modal().nativeElement.showModal();
  }

  fermer() {
    this.modal().nativeElement.close();
    this.modalOuvert.set(false);
  }

  clicFond(e: MouseEvent) {
    if (e.target === this.modal().nativeElement) this.fermer();
  }

  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.actifId();
    const valeurs = this.form.getRawValue();
    this.donnees.update(d => {
      let liste = d[id];
      const nouvelId = liste.length ? Math.max(...liste.map(l => Number(l['id']))) + 1 : 1;
      // une seule année en cours à la fois
      if (this.actif().statut && valeurs['enCours']) {
        liste = liste.map(l => ({ ...l, enCours: false }));
      }
      return { ...d, [id]: [...liste, { id: nouvelId, ...valeurs }] };
    });
    this.fermer();
  }

  definirEnCours(ligneId: number) {
    this.donnees.update(d => ({
      ...d,
      annee: d['annee'].map(l => ({ ...l, enCours: l['id'] === ligneId })),
    }));
  }

  supprimer(ligneId: number) {
    const id = this.actifId();
    this.donnees.update(d => ({ ...d, [id]: d[id].filter(l => l['id'] !== ligneId) }));
  }
}
