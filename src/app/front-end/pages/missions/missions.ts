import {
  Component,
  ElementRef,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../back-end/httpRequetteServices/api.service (1)';

export type OngletMission = 'INSPECTION' | 'AUDIT';

// Ce que le back-end renvoie dans GET /api/missions (champ "content")
export interface Mission {
  id: number;
  code: string;
  dateDebut: string;
  dateFin: string;
  localisation: string;
  matriculeChefPoste: string;
  chefPoste: string;
  objet: string;
  idAnnee: number;
  libelleAnnee: string;
  idPoste: number;
  codePoste: string;
  idTypeMission: number;
  codeTypeMission: string;
}

// La date de fin doit être après la date de début
function datesValides(g: AbstractControl): ValidationErrors | null {
  const d1 = g.get('dateDebut')?.value;
  const d2 = g.get('dateFin')?.value;
  return d1 && d2 && d2 < d1 ? { datesInvalides: true } : null;
}

// Le back-end peut renvoyer un tableau ou une page { content: [...] }
function extraire(data: any): any[] {
  return Array.isArray(data) ? data : (data?.content ?? data?.data ?? []);
}

@Component({
  selector: 'app-missions',
  imports: [ReactiveFormsModule],
  templateUrl: './missions.html',
  styleUrl: './missions.css',
})
export class Missions implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');

  missions = signal<Mission[]>([]);

  // Listes pour les menus déroulants du formulaire
  annees = signal<any[]>([]);
  postes = signal<any[]>([]);
  typesMission = signal<any[]>([]);

  // Onglet affiché : Inspection ou Audit
  activeTab = signal<OngletMission>('INSPECTION');

  // id de la mission en cours de modification (null = ajout)
  editId = signal<number | null>(null);

  form = this.fb.nonNullable.group(
    {
      codeMission: ['', Validators.required],
      localisation: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      chefPoste: ['', Validators.required],
      matriculeChefPoste: [''],
      objet: ['', Validators.required],
      idAnnee: [0, Validators.min(1)],
      idPoste: [0, Validators.min(1)],
      idTypeMission: [0, Validators.min(1)],
    },
    { validators: datesValides },
  );

  // Missions de l'onglet actif
  filteredMissions = computed(() =>
    this.missions().filter((m) => this.categorieDe(m) === this.activeTab()),
  );

  nbInspections = computed(
    () => this.missions().filter((m) => this.categorieDe(m) === 'INSPECTION').length,
  );
  nbAudits = computed(() => this.missions().filter((m) => this.categorieDe(m) === 'AUDIT').length);

  ngOnInit() {
    this.chargerMissions();
    this.chargerListes();
  }

  // ---------- Onglets ----------

  selectTab(tab: OngletMission) {
    this.activeTab.set(tab);
  }

  // Une mission est un "Audit" si la catégorie de son type de mission contient "audit"
  categorieDe(m: Mission): OngletMission {
    const type = this.typesMission().find((t) => t['id'] === m.idTypeMission);
    const texte = String(type?.['categorieMission'] ?? m.codeTypeMission ?? '').toLowerCase();
    return texte.includes('audit') ? 'AUDIT' : 'INSPECTION';
  }

  // Texte affiché dans les menus : on essaie plusieurs noms de champs
  etiquette(o: any, ...champs: string[]): string {
    for (const c of champs) {
      if (o?.[c]) return o[c];
    }
    return `#${o?.['id']}`;
  }

  // ---------- API : missions ----------

  chargerMissions() {
    this.api._get('api/missions').subscribe({
      next: (data: any) => {
        console.log('Réponse API missions :', data);
        this.missions.set(extraire(data));
      },
      error: (err: any) => console.error('Erreur chargement missions', err),
    });
  }

  // ---------- Données de départ : créées si elles n'existent pas ----------

  private anneesParDefaut = [
    { libelleAnnee: '2026', themeAnnee: 'Exercice 2026' },
    { libelleAnnee: '2027', themeAnnee: 'Exercice 2027' },
  ];

  private typesParDefaut = [
    { codeTypeMission: 'INS', categorieMission: 'Inspection' },
    { codeTypeMission: 'AUD', categorieMission: 'Audit' },
  ];

  // Exemples : remplace-les par tes vrais postes
  private postesParDefaut = [
    { codePoste: 'TG-BOUAKE', libellePoste: 'Trésorerie Générale de Bouaké' },
    { codePoste: 'PERC-DALOA', libellePoste: 'Perception de Daloa' },
    { codePoste: 'RF-ABENGOUROU', libellePoste: "Recette des Finances d'Abengourou" },
    { codePoste: 'TG-SANPEDRO', libellePoste: 'Trésorerie Générale de San-Pedro' },
  ];

  // Un seul essai de création par adresse et par session (évite les doublons)
  private dejaTente = new Set<string>();

  chargerListes() {
    this.chargerListe('api/annees', this.annees, this.anneesParDefaut, 'libelleAnnee');
    this.chargerListe(
      'api/type-missions',
      this.typesMission,
      this.typesParDefaut,
      'categorieMission',
    );
    this.chargerListe('api/postes', this.postes, this.postesParDefaut, 'codePoste', true);
  }

  // Charge une liste, puis crée les éléments par défaut qui manquent
  private chargerListe(
    adresse: string,
    cible: WritableSignal<any[]>,
    defauts: any[],
    cleUnique: string,
    siVideSeulement = false,
  ) {
    this.api._get(adresse).subscribe({
      next: (data: any) => {
        const liste = extraire(data);
        console.log(adresse, ':', liste);
        cible.set(liste);
        this.creerManquants(adresse, cible, liste, defauts, cleUnique, siVideSeulement);
      },
      error: (err: any) => console.error('Erreur chargement', adresse, err),
    });
  }

  private creerManquants(
    adresse: string,
    cible: WritableSignal<any[]>,
    existants: any[],
    defauts: any[],
    cleUnique: string,
    siVideSeulement: boolean,
  ) {
    if (this.dejaTente.has(adresse)) return;

    const manquants = siVideSeulement
      ? existants.length === 0
        ? defauts
        : []
      : defauts.filter(
          (d) =>
            !existants.some(
              (e) =>
                String(e[cleUnique] ?? '').toLowerCase() === String(d[cleUnique]).toLowerCase(),
            ),
        );
    if (manquants.length === 0) return;

    this.dejaTente.add(adresse);
    let restants = manquants.length;

    for (const element of manquants) {
      this.api._post(adresse, element).subscribe({
        next: () => {
          if (--restants === 0) {
            // tout est créé : on recharge la liste
            this.api._get(adresse).subscribe((data: any) => cible.set(extraire(data)));
          }
        },
        error: (err: any) => {
          restants--;
          console.error('Erreur création', adresse, element, err);
        },
      });
    }
  }

  // ---------- Modale ----------

  // mission absente = ajout ; mission fournie = modification
  ouvrir(mission?: Mission) {
    this.chargerListes();

    this.form.reset({
      codeMission: '',
      localisation: '',
      dateDebut: '',
      dateFin: '',
      chefPoste: '',
      matriculeChefPoste: '',
      objet: '',
      idAnnee: 0,
      idPoste: 0,
      idTypeMission: 0,
    });

    if (mission) {
      this.form.patchValue({
        codeMission: mission.code,
        localisation: mission.localisation,
        dateDebut: mission.dateDebut,
        dateFin: mission.dateFin,
        chefPoste: mission.chefPoste,
        matriculeChefPoste: mission.matriculeChefPoste,
        objet: mission.objet,
        idAnnee: mission.idAnnee,
        idPoste: mission.idPoste,
        idTypeMission: mission.idTypeMission,
      });
    } else {
      // Ajout : on présélectionne le type de mission qui correspond à l'onglet actif
      const motCle = this.activeTab() === 'AUDIT' ? 'audit' : 'inspect';
      const type = this.typesMission().find((t) =>
        String(t['categorieMission'] ?? t['codeTypeMission'] ?? '')
          .toLowerCase()
          .includes(motCle),
      );
      if (type) this.form.patchValue({ idTypeMission: type['id'] });
    }

    this.editId.set(mission ? mission.id : null);
    this.modal().nativeElement.showModal();
  }

  fermer() {
    this.modal().nativeElement.close();
    this.editId.set(null);
  }

  // ---------- API : enregistrer (ajout ou modification) ----------

  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // On convertit les id en nombres avant l'envoi
    const v = this.form.getRawValue();
    const donnees = {
      ...v,
      idAnnee: Number(v.idAnnee),
      idPoste: Number(v.idPoste),
      idTypeMission: Number(v.idTypeMission),
    };

    const editId = this.editId();
    const requete =
      editId !== null
        ? this.api._put(`api/missions/${editId}`, donnees)
        : this.api._post('api/missions', donnees);

    requete.subscribe({
      next: () => {
        this.chargerMissions();
        this.fermer();
      },
      error: (err: any) => console.error('Erreur enregistrement mission', err),
    });
  }

  // ---------- API : suppression ----------

  supprimer(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer cette mission ?')) return;
    this.api._delete(`api/missions/${id}`).subscribe({
      next: () => this.chargerMissions(),
      error: (err: any) => console.error('Erreur suppression mission', err),
    });
  }

  // Ferme le modal si on clique sur le fond
  clicFond(e: MouseEvent) {
    if (e.target === this.modal().nativeElement) this.fermer();
  }
}
