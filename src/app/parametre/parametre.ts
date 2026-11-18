import { Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnneeExerciceService } from '../back-end/services/parametre/anneeExercice.service';
import { TypeMissionService } from '../back-end/services/parametre/typeMission.service';
import { TypePosteService } from '../back-end/services/parametre/typePoste.service';
interface Champ {
  cle: string;
  label: string;
  type?: 'text' | 'date' | 'textarea' | 'select'| 'password';
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
      { cle: 'libelleAnnee', label: 'Libellé', requis: true },
      { cle: 'themeAnnee', label: 'Thème', requis: true },
    ],
  },
  {
    // pas d'entité dédiée dans le MCD : on utilise Cate_miss de type_mission
    id: 'categorie',
    label: 'Catégorie',
    champs: [{ cle: 'Cate_miss', label: 'Catégorie de mission', requis: true, pleine: true }],
  },
  {
    // entité type_mission : , codeTypeMissions
    id: 'type',
    label: 'Type de mission',
    champs: [
      { cle: 'codeTypeMission', label: 'Code type de mission', requis: true },
      { cle: 'categorieMission', label: 'Catégorie de mission', requis: true },
    ],
  },
  {
    // entité agent : Cod_miss, D_db_miss, D_fin_miss
    id: 'agent',
    label: 'Agent',
    champs: [
      { cle: 'nom', label: 'Nom', requis: true },
      { cle: 'prenom', label: 'Prénom', requis: true },
      { cle: 'matricule', label: 'Matricule', requis: true },
      { cle: 'motDePasse', label: 'Mot de passe', type: 'password', requis: true },
      { cle: 'dateNaissance', label: 'Date de naissance', type: 'date', requis: true },
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
  {
    // ATTENTION : noms de champs supposés, à vérifier dans Swagger (POST /api/type-postes)
    id: 'typeposte',
    label: 'Type de poste',
    champs: [
      { cle: 'codeTypePoste', label: 'Code', requis: true },
      { cle: 'libelleTypePoste', label: 'Libellé', requis: true },
    ],
  },
];

@Component({
  selector: 'app-parametre',
  imports: [ReactiveFormsModule],
  templateUrl: './parametre.html',
  styleUrl: './parametre.css',
})
export class Parametre implements OnInit {
  private fb = inject(FormBuilder);
  private anneeService = inject(AnneeExerciceService);
  private typeMissionService = inject(TypeMissionService);
  private typePosteService = inject(TypePosteService);

  // Associe chaque onglet à ses appels API (les onglets absents restent en local)
  private api: Record<
    string,
    {
      getAll: () => any;
      create: (d: any) => any;
      update: (id: any, d: any) => any;
      delete: (id: any) => any;
    }
  > = {
    annee: {
      getAll: () => this.anneeService.getAllAnnees(),
      create: (d) => this.anneeService.createAnnee(d),
      update: (id, d) => this.anneeService.updateAnnee(id, d),
      delete: (id) => this.anneeService.deleteAnnee(id),
    },
    type: {
      getAll: () => this.typeMissionService.getAllTypeMissions(),
      create: (d) => this.typeMissionService.createTypeMission(d),
      update: (id, d) => this.typeMissionService.updateTypeMission(id, d),
      delete: (id) => this.typeMissionService.deleteTypeMission(id),
    },
    typeposte: {
      getAll: () => this.typePosteService.getAllTypePostes(),
      create: (d) => this.typePosteService.createTypePoste(),
      update: (id, d) => this.typePosteService.updateTypePoste(),
      delete: (id) => this.typePosteService.deleteTypePoste(),
    },
  };

  params = PARAMS;
  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  modalOuvert = signal(false);

  // id de la ligne en cours de modification (null = mode ajout)
  editId = signal<number | null>(null);
  modeEdition = computed(() => this.editId() !== null);

  actifId = signal('annee');
  actif = computed(() => this.params.find((p) => p.id === this.actifId())!);

  donnees = signal<Record<string, Ligne[]>>({
    annee: [], // rempli par l'API
    categorie: [],
    type: [], // rempli par l'API
    agent: [],
    recommandation: [],
    famille: [],
    sousfamille: [],
    typeposte: [],
  });

  lignes = computed(() => this.donnees()[this.actifId()] ?? []);
  anneeEnCours = computed(() => this.donnees()['annee'].find((l) => l['enCours']));

  form: FormGroup = this.fb.group({});

  // Colonne affichée pour chaque liste déroulante liée
  libelleCle: Record<string, string> = { famille: 'Lib_fam' };

  ngOnInit() {
    this.charger('annee');
    this.charger('type');
    this.charger('annee');
    this.charger('type');
    this.charger('typeposte');
  }

  // ---------- API : chargement d'un onglet ----------

  charger(id: string) {
    const a = this.api[id];
    if (!a) return;
    a.getAll().subscribe({
      next: (data: any) => {
        console.log(`Réponse API ${id} :`, data); // pour vérifier la forme
        const liste = Array.isArray(data) ? data : (data?.content ?? data?.data ?? []);
        this.donnees.update((d) => ({ ...d, [id]: liste }));
      },
      error: (err: any) => console.error(`Erreur chargement ${id}`, err),
    });
  }

  // ---------- Utilitaires ----------

  typeDe(c: Champ): string {
    return c.type ?? 'text';
  }

  options(source: string) {
    return this.donnees()[source] ?? [];
  }

  libelle(source: string, id: any) {
    const l = this.options(source).find((x) => x['id'] == id);
    return l ? l[this.libelleCle[source]] : '-';
  }

  choisir(id: string) {
    this.actifId.set(id);
    this.charger(id);
  }

  // ---------- Modale ----------

  // ligne absente = ajout ; ligne fournie = modification
  ouvrir(ligne?: Ligne) {
    const p = this.actif();
    const controles: Record<string, any> = {};
    for (const c of p.champs) {
      controles[c.cle] = [ligne?.[c.cle] ?? '', c.requis ? Validators.required : []];
    }
    if (p.statut) controles['enCours'] = [ligne?.['enCours'] ?? false];
    this.form = this.fb.group(controles);
    this.editId.set(ligne ? Number(ligne['id']) : null);
    this.modalOuvert.set(true);
    this.modal().nativeElement.showModal();
  }

  fermer() {
    this.modal().nativeElement.close();
    this.modalOuvert.set(false);
    this.editId.set(null);
  }

  clicFond(e: MouseEvent) {
    if (e.target === this.modal().nativeElement) this.fermer();
  }

  // ---------- Enregistrer (ajout ou modification) ----------

  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.actifId();
    const valeurs = this.form.getRawValue();
    const editId = this.editId();

    // Onglet branché sur l'API
    const a = this.api[id];
    if (a) {
      const requete = editId !== null ? a.update(editId, valeurs) : a.create(valeurs);
      requete.subscribe({
        next: () => {
          this.charger(id);
          this.fermer();
        },
        error: (err: any) => console.error(`Erreur enregistrement ${id}`, err),
      });
      return;
    }

    // Onglets pas encore branchés : en local
    this.donnees.update((d) => {
      const liste = d[id];
      if (editId !== null) {
        return { ...d, [id]: liste.map((l) => (l['id'] === editId ? { ...l, ...valeurs } : l)) };
      }
      const nouvelId = liste.length ? Math.max(...liste.map((l) => Number(l['id']))) + 1 : 1;
      return { ...d, [id]: [...liste, { id: nouvelId, ...valeurs }] };
    });
    this.fermer();
  }

  // Pour l'instant uniquement à l'écran (pas encore enregistré en base)
  definirEnCours(ligneId: number) {
    this.donnees.update((d) => ({
      ...d,
      annee: d['annee'].map((l) => ({ ...l, enCours: l['id'] === ligneId })),
    }));
  }

  // ---------- Suppression ----------

  supprimer(ligneId: number) {
    if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) return;

    const id = this.actifId();
    const a = this.api[id];

    if (a) {
      a.delete(ligneId).subscribe({
        next: () => this.charger(id),
        error: (err: any) => console.error(`Erreur suppression ${id}`, err),
      });
      return;
    }

    this.donnees.update((d) => ({ ...d, [id]: d[id].filter((l) => l['id'] !== ligneId) }));
  }
}
