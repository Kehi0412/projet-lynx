import { Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { AnneeExerciceService } from '../back-end/services/parametre/anneeExercice.service';
import { AgentService } from '../back-end/services/parametre/agent.service';
import { CategorieService } from '../back-end/services/parametre/categorie.service';
import { FamilleService } from '../back-end/services/parametre/famille.service';
import { PosteService } from '../back-end/services/parametre/poste.service';
import { ProcessusService } from '../back-end/services/parametre/processus.service';
import { RecomandationService } from '../back-end/services/parametre/recomandation.service';
import { SousFamilleService } from '../back-end/services/parametre/sousFamille.service';
import { TypeMissionService } from '../back-end/services/parametre/typeMission.service';
import { TypePosteService } from '../back-end/services/parametre/typePoste.service';

interface Champ {
  cle: string;
  label: string;
  type?: 'text' | 'date' | 'textarea' | 'select' | 'password' | 'number';
  source?: string;
  requis?: boolean;
  pleine?: boolean;
}

interface Param {
  id: string;
  label: string;
  champs: Champ[];
  statut?: boolean;
}

type Ligne = Record<string, any>;

export const PARAMS: Param[] = [
  // ANNÉE D'EXERCICE
  {
    id: 'annee',
    label: "Année d'exercice",
    statut: true,
    champs: [
      { cle: 'libelleAnnee', label: 'Libellé', requis: true },
      { cle: 'theme', label: 'Thème' },
    ],
  },

  // CATÉGORIE
  {
    id: 'categorie',
    label: 'Catégorie',
    champs: [
      { cle: 'nom', label: 'Nom', requis: true },
      { cle: 'type', label: 'Type' },
      {
        cle: 'idTypeMission',
        label: 'Type de mission',
        type: 'number',
        requis: true,
      },
    ],
  },

  // TYPE DE MISSION
  {
    id: 'type',
    label: 'Type de mission',
    champs: [
      { cle: 'codeTypeMission', label: 'Code type de mission', requis: true },
      { cle: 'categorieMission', label: 'Catégorie de mission', requis: true },
    ],
  },

  // AGENT
  {
    id: 'agent',
    label: 'Agent',
    champs: [
      { cle: 'nom', label: 'Nom', requis: true },
      { cle: 'prenom', label: 'Prénom', requis: true },
      { cle: 'matricule', label: 'Matricule', requis: true },
      {
        cle: 'motDePasse',
        label: 'Mot de passe',
        type: 'password',
      },
      {
        cle: 'dateNaissance',
        label: 'Date de naissance',
        type: 'date',
        requis: true,
      },
    ],
  },

  // POSTE
  {
    id: 'poste',
    label: 'Poste',
    champs: [
      { cle: 'codePoste', label: 'Code poste', requis: true },
      { cle: 'libelleCourt', label: 'Libellé court', requis: true },
      {
        cle: 'libelleLong',
        label: 'Libellé long',
        type: 'textarea',
        requis: true,
        pleine: true,
      },
      {
        cle: 'matriculeResponsable',
        label: 'Matricule du responsable',
      },
      {
        cle: 'typePosteId',
        label: 'Type de poste',
        type: 'select',
        source: 'typeposte',
        requis: true,
      },
      {
        cle: 'processusId',
        label: 'Processus',
        type: 'select',
        source: 'processus',
        requis: true,
      },
    ],
  },

  // PROCESSUS
  {
    id: 'processus',
    label: 'Processus',
    champs: [
      { cle: 'code', label: 'Code', requis: true },
      { cle: 'libelle', label: 'Libellé', requis: true },
      { cle: 'libelleCourt', label: 'Libellé court' },
      {
        cle: 'libelleLongProcessus',
        label: 'Libellé long',
        type: 'textarea',
        pleine: true,
      },
    ],
  },

  // RECOMMANDATION
  {
    id: 'recommandation',
    label: 'Recommandation',
    champs: [
      {
        cle: 'libelle',
        label: 'Libellé',
        requis: true,
        pleine: true,
      },
      {
        cle: 'constat',
        label: 'Constat',
        type: 'textarea',
        pleine: true,
      },
      {
        cle: 'causeConstat',
        label: 'Cause du constat',
        type: 'textarea',
        pleine: true,
      },
      {
        cle: 'dateDebut',
        label: 'Date de début',
        type: 'date',
      },
      {
        cle: 'dateFin',
        label: 'Date de fin',
        type: 'date',
      },
      {
        cle: 'objectif',
        label: 'Objectif',
        type: 'textarea',
        pleine: true,
      },
      {
        cle: 'preuveAttendue',
        label: 'Preuve attendue',
        type: 'textarea',
        pleine: true,
      },
      {
        cle: 'idSousFamille',
        label: 'Identifiant de sous-famille',
        type: 'number',
        requis: true,
      },
      {
        cle: 'idMission',
        label: 'Identifiant de mission',
        type: 'number',
        requis: true,
      },
    ],
  },

  // FAMILLE
  {
    id: 'famille',
    label: 'Famille',
    champs: [
      { cle: 'codeFamille', label: 'Code', requis: true },
      { cle: 'libelle', label: 'Libellé', requis: true },
      { cle: 'type', label: 'Type' },
      { cle: 'nature', label: 'Nature' },
      {
        cle: 'idSousFamille',
        label: 'Sous-famille',
        type: 'number',
        requis: true,
      },
    ],
  },

  // SOUS-FAMILLE
  {
    id: 'sousfamille',
    label: 'Sous-famille',
    champs: [
      { cle: 'codeSousFamille', label: 'Code', requis: true },
      { cle: 'libelleSousFamille', label: 'Libellé', requis: true },
      {
        cle: 'typeSousFamille',
        label: 'Type',
        type: 'select',
        source: 'typeElement',
      },
    ],
  },

  // TYPE DE POSTE
  {
    id: 'typeposte',
    label: 'Type de poste',
    champs: [
      { cle: 'codeType', label: 'Code', requis: true },
      { cle: 'libelleCourtType', label: 'Libellé court', requis: true },
      {
        cle: 'libelleLongType',
        label: 'Libellé long',
        type: 'textarea',
        pleine: true,
      },
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
  private route = inject(ActivatedRoute);
  private toast = inject(ToastrService);

  // SERVICES
  private anneeService = inject(AnneeExerciceService);
  private agentService = inject(AgentService);
  private categorieService = inject(CategorieService);
  private familleService = inject(FamilleService);
  private posteService = inject(PosteService);
  private processusService = inject(ProcessusService);
  private recommandationService = inject(RecomandationService);
  private sousFamilleService = inject(SousFamilleService);
  private typeMissionService = inject(TypeMissionService);
  private typePosteService = inject(TypePosteService);

  // CONFIGURATION DES API
  private api: Record<string, any> = {
    annee: {
      getAll: () => this.anneeService.getAllAnnees(),
      create: (d: any) => this.anneeService.createAnnee(d),
      update: (id: any, d: any) => this.anneeService.updateAnnee(id, d),
      delete: (id: any) => this.anneeService.deleteAnnee(id),
    },

    categorie: {
      getAll: () => this.categorieService.getAll(),
      create: (d: any) => this.categorieService.create(d),
      update: (id: any, d: any) => this.categorieService.update(id, d),
      delete: (id: any) => this.categorieService.delete(id),
    },

    type: {
      getAll: () => this.typeMissionService.getAllTypeMissions(),
      create: (d: any) => this.typeMissionService.createTypeMission(d),
      update: (id: any, d: any) => this.typeMissionService.updateTypeMission(id, d),
      delete: (id: any) => this.typeMissionService.deleteTypeMission(id),
    },

    agent: {
      getAll: () => this.agentService.getAll(),
      create: (d: any) => this.agentService.create(d),
      update: (id: any, d: any) => this.agentService.update(id, d),
      delete: (id: any) => this.agentService.delete(id),
    },

    typeposte: {
      getAll: () => this.typePosteService.getAll(),
      create: (d: any) => this.typePosteService.create(d),
      update: (id: any, d: any) => this.typePosteService.update(id, d),
      delete: (id: any) => this.typePosteService.delete(id),
    },

    poste: {
      getAll: () => this.posteService.getAll(),
      create: (d: any) => this.posteService.create(d),
      update: (id: any, d: any) => this.posteService.update(id, d),
      delete: (id: any) => this.posteService.delete(id),
    },

    processus: {
      getAll: () => this.processusService.getAll(),
      create: (d: any) => this.processusService.create(d),
      update: (id: any, d: any) => this.processusService.update(id, d),
      delete: (id: any) => this.processusService.delete(id),
    },

    famille: {
      getAll: () => this.familleService.getAll(),
      create: (d: any) => this.familleService.create(d),
      update: (id: any, d: any) => this.familleService.update(id, d),
      delete: (id: any) => this.familleService.delete(id),
    },

    sousfamille: {
      getAll: () => this.sousFamilleService.getAll(),
      create: (d: any) => this.sousFamilleService.create(d),
      update: (id: any, d: any) => this.sousFamilleService.update(id, d),
      delete: (id: any) => this.sousFamilleService.delete(id),
    },

    recommandation: {
      getAll: () => this.recommandationService.getAll(),
      create: (d: any) => this.recommandationService.create(d),
      update: (id: any, d: any) => this.recommandationService.update(id, d),
      delete: (id: any) => this.recommandationService.delete(id),
    },
  };

  params = PARAMS;

  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');

  confirmationModal = viewChild.required<ElementRef<HTMLDialogElement>>('confirmationModal');

  modalOuvert = signal(false);
  confirmationOuverte = signal(false);

  editId = signal<number | null>(null);

  modeEdition = computed(() => this.editId() !== null);

  actifId = signal('annee');

  actif = computed(() => this.params.find((p) => p.id === this.actifId())!);

  donnees = signal<Record<string, Ligne[]>>({
    annee: [],
    categorie: [],
    type: [],
    agent: [],
    poste: [],
    processus: [],
    recommandation: [],
    famille: [],
    sousfamille: [],
    typeposte: [],

    typeElement: [
      { id: 'FAMILLE_RISQUE', libelle: 'Famille risque' },
      { id: 'SOUS_FAMILLE_RISQUE', libelle: 'Sous-famille risque' },
      { id: 'FAMILLE_CONSTAT', libelle: 'Famille constat' },
      { id: 'SOUS_FAMILLE_CONSTAT', libelle: 'Sous-famille constat' },
    ],
  });

  lignes = computed(() => this.donnees()[this.actifId()] ?? []);

  anneeEnCours = computed(() => this.donnees()['annee'].find((l) => l['enCours']));

  form: FormGroup = this.fb.group({});

  // LIBELLÉS DES LISTES DÉROULANTES
  libelleCle: Record<string, string> = {
    famille: 'libelle',
    typeElement: 'libelle',
    typeposte: 'libelleCourtType',
    processus: 'libelle',
  };

  // ANNÉE EN COURS : mémorisée dans le navigateur (le back-end n'a pas ce champ)
  private readonly CLE_ANNEE = 'linx_annee_en_cours';
  private libelleEnAttente: string | null = null;

  anneeEnCoursId = signal<number | null>(
    Number(localStorage.getItem('linx_annee_en_cours')) || null,
  );

  private fixerAnneeEnCours(id: number | null) {
    this.anneeEnCoursId.set(id);

    if (id === null) localStorage.removeItem(this.CLE_ANNEE);
    else localStorage.setItem(this.CLE_ANNEE, String(id));

    this.donnees.update((d) => ({
      ...d,
      annee: d['annee'].map((l) => ({ ...l, enCours: l['id'] === id })),
    }));
  }

  // INITIALISATION
  ngOnInit() {
    this.route.queryParamMap.subscribe((queryParams) => {
      const module = queryParams.get('module');

      if (module && this.params.some((param) => param.id === module)) {
        this.actifId.set(module);
      }
    });

    this.charger('annee');
    this.charger('categorie');
    this.charger('type');
    this.charger('agent');
    this.charger('typeposte');
    this.charger('poste');
    this.charger('processus');
    this.charger('famille');
    this.charger('sousfamille');
    this.charger('recommandation');
  }

  // CHARGEMENT API
  charger(id: string) {
    const a = this.api[id];

    if (!a) return;

    a.getAll().subscribe({
      next: (data: any) => {
        console.log(`Réponse API ${id} :`, data);

        let liste = Array.isArray(data) ? data : (data?.content ?? data?.data ?? []);

        if (id === 'annee') {
          // Une année vient d'être créée avec « en cours » coché : on la retrouve par son libellé
          if (this.libelleEnAttente) {
            const trouvee = liste
              .filter((l: any) => l['libelleAnnee'] === this.libelleEnAttente)
              .sort((x: any, y: any) => y['id'] - x['id'])[0];

            this.libelleEnAttente = null;

            if (trouvee) {
              this.anneeEnCoursId.set(trouvee['id']);
              localStorage.setItem(this.CLE_ANNEE, String(trouvee['id']));
            }
          }

          // On applique le statut mémorisé
          const courante = this.anneeEnCoursId();
          liste = liste.map((l: any) => ({ ...l, enCours: l['id'] === courante }));
        }

        this.donnees.update((d) => ({
          ...d,
          [id]: liste,
        }));
      },

      error: (err: any) => {
        console.error(`Erreur chargement ${id}`, err);
      },
    });
  }

  // MESSAGE D'ERREUR LISIBLE (texte du serveur si disponible)
  private messageErreur(err: any, defaut: string): string {
    if (typeof err === 'string') return err;

    return err?.error?.message ?? err?.error?.error ?? defaut;
  }

  // OPTIONS DES LISTES DÉROULANTES
  options(source: string) {
    return this.donnees()[source] ?? [];
  }

  libelle(source: string, id: any) {
    const l = this.options(source).find((x) => x['id'] == id);

    if (!l) return '-';

    return (
      l[this.libelleCle[source]] ?? l['libelle'] ?? l['libelleLong'] ?? l['libelleCourt'] ?? '-'
    );
  }

  // CONFIRMATION
  valeurConfirmation(champ: Champ): string {
    const valeur = this.form.get(champ.cle)?.value;

    if (champ.type === 'password') return valeur ? '••••••' : '-';

    if (champ.type === 'select') {
      return this.libelle(champ.source!, valeur);
    }

    return valeur === null || valeur === undefined || valeur === '' ? '-' : String(valeur);
  }

  libelleConfirmation(): string {
    const champLibelle = this.actif().champs.find((champ) =>
      champ.cle.toLowerCase().includes('libelle'),
    );

    const champAffiche = champLibelle ?? this.actif().champs[0];

    return champAffiche ? this.valeurConfirmation(champAffiche) : '-';
  }

  nomElementConfirmation(): string {
    const noms: Record<string, string> = {
      annee: 'l’année',
      categorie: 'la catégorie',
      type: 'le type de mission',
      agent: 'l’agent',
      poste: 'le poste',
      processus: 'le processus',
      recommandation: 'la recommandation',
      famille: 'la famille',
      sousfamille: 'la sous-famille',
      typeposte: 'le type de poste',
    };

    return noms[this.actifId()] ?? this.actif().label.toLowerCase();
  }

  // CHANGEMENT D'ONGLET
  choisir(id: string) {
    this.actifId.set(id);
    this.charger(id);
  }

  // OUVERTURE DU FORMULAIRE
  ouvrir(ligne?: Ligne) {
    const p = this.actif();

    const controles: Record<string, any> = {};

    for (const c of p.champs) {
      controles[c.cle] = [ligne?.[c.cle] ?? '', c.requis ? Validators.required : []];
    }

    if (p.statut) {
      controles['enCours'] = [ligne?.['enCours'] ?? false];
    }

    this.form = this.fb.group(controles);

    this.editId.set(ligne ? Number(ligne['id']) : null);

    this.confirmationOuverte.set(false);
    this.modalOuvert.set(true);

    this.modal().nativeElement.showModal();
  }

  fermer() {
    this.modal().nativeElement.close();

    this.modalOuvert.set(false);
    this.confirmationOuverte.set(false);

    this.editId.set(null);
  }

  clicFond(e: MouseEvent) {
    if (e.target === this.modal().nativeElement) {
      this.fermer();
    }
  }

  clicFondConfirmation(e: MouseEvent) {
    if (e.target === this.confirmationModal().nativeElement) {
      this.annulerConfirmation();
    }
  }

  // DEMANDER CONFIRMATION
  demanderConfirmation() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirmationOuverte.set(true);

    this.confirmationModal().nativeElement.showModal();
  }

  annulerConfirmation() {
    this.confirmationModal().nativeElement.close();

    this.confirmationOuverte.set(false);
  }

  // ENREGISTREMENT
  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.editId() === null) {
      this.demanderConfirmation();
      return;
    }

    this.enregistrerDefinitivement();
  }

  confirmerEnregistrement() {
    this.annulerConfirmation();

    this.enregistrerDefinitivement();
  }

  private enregistrerDefinitivement() {
    const id = this.actifId();
    const titre = this.actif().label;

    const valeurs = {
      ...this.form.getRawValue(),
    };

    // CONVERSION DES IDENTIFIANTS EN NOMBRES
    for (const champ of this.actif().champs) {
      if (
        (champ.type === 'number' || champ.type === 'select') &&
        valeurs[champ.cle] !== '' &&
        valeurs[champ.cle] !== null
      ) {
        const valeur = Number(valeurs[champ.cle]);

        if (!Number.isNaN(valeur)) {
          valeurs[champ.cle] = valeur;
        }
      }
    }

    // LE STATUT « EN COURS » N'EXISTE PAS CÔTÉ API : on le garde à part
    const enCours = !!valeurs['enCours'];
    delete valeurs['enCours'];

    const editId = this.editId();

    const a = this.api[id];

    if (a) {
      console.log('Données envoyées à l’API :', valeurs);

      const requete = editId !== null ? a.update(editId, valeurs) : a.create(valeurs);

      requete.subscribe({
        next: (response: any) => {
          console.log('Enregistrement réussi :', response);

          // Mémoriser l'année en cours
          if (id === 'annee') {
            const idAnnee = editId ?? response?.id ?? null;

            if (enCours) {
              if (idAnnee !== null) {
                this.anneeEnCoursId.set(idAnnee);
                localStorage.setItem(this.CLE_ANNEE, String(idAnnee));
              } else {
                this.libelleEnAttente = String(valeurs['libelleAnnee']);
              }
            } else if (editId !== null && editId === this.anneeEnCoursId()) {
              this.fixerAnneeEnCours(null);
            }
          }

          this.charger(id);
          this.fermer();

          this.toast.success(editId !== null ? 'Modifié avec succès' : 'Ajouté avec succès', titre);
        },

        error: (err: any) => {
          console.error(`Erreur enregistrement ${id}`, err);
          console.error('Détail du serveur :', err.error);

          this.toast.error(this.messageErreur(err, "L'enregistrement a échoué"), titre);
        },
      });

      return;
    }
  }

  // DÉFINIR ANNÉE EN COURS
  definirEnCours(ligneId: number) {
    this.fixerAnneeEnCours(ligneId);

    this.toast.success('Année en cours définie', this.actif().label);
  }

  // SUPPRESSION
  supprimer(ligneId: number) {
    const id = this.actifId();
    const titre = this.actif().label;

    if (id === 'annee' && ligneId === this.anneeEnCoursId()) {
      this.toast.warning(
        "Impossible de supprimer l'année en cours. Définissez d'abord une autre année en cours.",
        titre,
      );
      return;
    }

    if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) {
      return;
    }

    const a = this.api[id];

    if (a) {
      a.delete(ligneId).subscribe({
        next: () => {
          this.charger(id);
          this.toast.success('Supprimé avec succès', titre);
        },

        error: (err: any) => {
          console.error(`Erreur suppression ${id}`, err);

          this.toast.error(this.messageErreur(err, 'La suppression a échoué'), titre);
        },
      });

      return;
    }
  }
}
