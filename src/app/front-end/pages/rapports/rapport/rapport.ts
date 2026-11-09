import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

interface Reco {
  id: number;
  annee: string;           // année de gestion
  mission: string;
  typeMission: string;     // Inspection | Audit
  poste: string;
  irt: string;
  localite: string;
  constat: string;
  cause: string;
  libelle: string;         // recommandation
  objectif: string;
  processus: string;       // code PM1, PR6, PS5...
  famille: string;
  sousFamille: string;
  pilote: string;
  attributaire: string;
  dateDebut: string;
  dateFin: string;
  preuve: string;          // preuve attendue
  observation: string;
  etape: string;           // circuit : voir ETAPES
  dateSoumission: string | null;
  dateValidation: string | null;
}

const PROCESSUS = [
  { code: 'PM1', lib: "Gérer l'écoute client et la communication" },
  { code: 'PM2', lib: 'Coordonner la stratégie institutionnelle' },
  { code: 'PM3', lib: 'Manager les performances et les risques' },
  { code: 'PM4', lib: 'Surveiller la gouvernance' },
  { code: 'PR1', lib: 'Mobiliser les recettes fiscales et non fiscales' },
  { code: 'PR2', lib: "Mobiliser les ressources d'emprunt et les dons" },
  { code: 'PR3', lib: "Gérer la trésorerie de l'Etat" },
  { code: 'PR4', lib: 'Gérer les fonds et les dépôts' },
  { code: 'PR5', lib: 'Assurer la règlementation de la dépense' },
  { code: 'PR6', lib: 'Tenir les comptes publics et parapublics' },
  { code: 'PR7', lib: "Réglementer et assister l'activité comptable" },
  { code: 'PR8', lib: "Réguler l'activité financière" },
  { code: 'PR9', lib: 'Réaliser les études économiques et financières' },
  { code: 'PS1', lib: 'Gérer les moyens généraux' },
  { code: 'PS2', lib: 'Gérer les ressources humaines' },
  { code: 'PS3', lib: 'Gérer la formation' },
  { code: 'PS4', lib: "Gérer le système d'information documentaire" },
  { code: 'PS5', lib: 'Gérer le système informatique' },
  { code: 'PS6', lib: "Assurer la sécurité et l'Hygiène" },
];

const GROUPES = [
  { nom: 'Management', prefixe: 'PM' },
  { nom: 'Réalisation', prefixe: 'PR' },
  { nom: 'Support', prefixe: 'PS' },
];

const FAMILLES = [
  "Conditions d'exercice de la fonction de Comptable Public",
  'Comptabilité',
  'Informatique',
  'Locaux',
  'Managérial',
  'Matériel et Equipement',
  'Sécurité',
  'Archivage',
  "Condition d'existence d'un service ou d'un poste comptable",
];

const IRTS = [
  "Antenne Régionale d'Abengourou", 'Antenne Régionale de Bouaké', 'Antenne Régionale d’Abidjan Sud',
  'Antenne Régionale d’Abidjan Nord', 'Antenne Régionale de Korhogo', 'Antenne Régionale d’Abidjan Centre',
  'Antenne Régionale d’Odienné', 'Antenne Régionale de Yamoussoukro', 'Antenne Régionale San-Pedro',
  'Antenne Régionale de Man', 'Antenne Régionale de Daloa', "Division de l'Audit Interne (DAI)",
  "Division des Opérations de Contrôle (Missions à l'Etranger)",
];

// Circuit d'une recommandation dans LINX V2
const ETAPES = ['À soumettre', 'À mettre en œuvre', 'Exécutée', 'Validée', 'Rejetée'];

const ETATS = [
  { id: 'toutes', label: 'Liste générale' },
  { id: 'echues', label: 'Échues' },
  { id: 'encours', label: "En cours d'exécution" },
  { id: 'nondemarrees', label: 'Non démarrées' },
  { id: 'nonvalidees', label: 'Non validées' },
  { id: 'horsdelai', label: 'Validées hors délai' },
];

const FILTRES_VIDES = {
  annee: '', trimestre: '', typeMission: '', processus: '', famille: '', irt: '', niveau: '', etape: '',
};

@Component({
  selector: 'app-rapport',
  imports: [DatePipe],
  templateUrl: './rapport.html',
  styleUrl: './rapport.css',
})
export class Rapport {
  readonly anneeEnCours = '2027';
  readonly annees = ['2027', '2026'];
  readonly processus = PROCESSUS;
  readonly familles = FAMILLES;
  readonly irts = IRTS;
  readonly etapes = ETAPES;
  readonly etats = ETATS;

  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  detail = signal<Reco | null>(null);

  // Exemples : à remplacer par les données du backend
  recos = signal<Reco[]>([
    { id: 1, annee: '2026', mission: 'M-2026-014', typeMission: 'Inspection', poste: 'Trésorerie Générale de Bouaké',
      irt: 'Antenne Régionale de Bouaké', localite: 'Bouaké', constat: 'Caisse non tenue',
      cause: 'Absence de suivi quotidien', libelle: 'Tenir la caisse chaque jour', objectif: 'Fiabiliser les disponibilités',
      processus: 'PR3', famille: 'Comptabilité', sousFamille: '2.1 Disponibilités', pilote: 'DDPD', attributaire: 'Chef de Poste',
      dateDebut: '2026-06-01', dateFin: '2026-09-30', preuve: 'Registre de caisse à jour', observation: '',
      etape: 'Exécutée', dateSoumission: '2026-05-20', dateValidation: '2026-05-23' },
    { id: 2, annee: '2026', mission: 'M-2026-014', typeMission: 'Inspection', poste: 'Trésorerie Générale de Bouaké',
      irt: 'Antenne Régionale de Bouaké', localite: 'Bouaké', constat: 'Prestation de serment non effectuée',
      cause: 'Nomination récente', libelle: 'Faire prêter serment au comptable', objectif: 'Régulariser la situation du comptable',
      processus: 'PM4', famille: "Conditions d'exercice de la fonction de Comptable Public", sousFamille: '1.1 Prestation de serment',
      pilote: 'IGT', attributaire: 'IGT', dateDebut: '2026-06-01', dateFin: '2026-08-30', preuve: 'Procès-verbal de serment',
      observation: '', etape: 'Validée', dateSoumission: '2026-05-20', dateValidation: '2026-05-23' },
    { id: 3, annee: '2026', mission: 'M-2026-021', typeMission: 'Inspection', poste: 'Perception de Daloa',
      irt: 'Antenne Régionale de Daloa', localite: 'Daloa', constat: 'Réseau défectueux',
      cause: 'Câblage ancien', libelle: 'Rétablir le réseau', objectif: 'Assurer la connexion aux applicatifs',
      processus: 'PS5', famille: 'Informatique', sousFamille: '3.3 Qualité du réseau', pilote: 'DSI', attributaire: 'DSI_DGTCP',
      dateDebut: '2026-07-01', dateFin: '2026-10-31', preuve: 'Rapport de test du réseau', observation: '',
      etape: 'À mettre en œuvre', dateSoumission: '2026-06-10', dateValidation: '2026-06-20' },
    { id: 4, annee: '2026', mission: 'A-2026-004', typeMission: 'Audit', poste: 'Direction du Matériel',
      irt: "Division de l'Audit Interne (DAI)", localite: 'Abidjan', constat: 'Réunions de service non tenues',
      cause: 'Absence de calendrier', libelle: 'Tenir une réunion de service par mois', objectif: 'Améliorer la coordination',
      processus: 'PM2', famille: 'Managérial', sousFamille: '5.3 Tenue de réunion de service', pilote: 'DEMO', attributaire: 'DEMO',
      dateDebut: '2026-03-01', dateFin: '2026-12-31', preuve: 'Comptes rendus de réunion', observation: '',
      etape: 'Validée', dateSoumission: '2026-02-20', dateValidation: '2026-03-05' },
    { id: 5, annee: '2026', mission: 'A-2026-004', typeMission: 'Audit', poste: 'Direction du Matériel',
      irt: "Division de l'Audit Interne (DAI)", localite: 'Abidjan', constat: 'Archives non rangées',
      cause: 'Manque de personnel', libelle: 'Ranger les archives', objectif: 'Faciliter la recherche des documents',
      processus: 'PS4', famille: 'Archivage', sousFamille: '8.4 Rangement de documents', pilote: 'DDA', attributaire: 'Chef de Poste',
      dateDebut: '2026-03-01', dateFin: '2026-06-30', preuve: "Inventaire des archives", observation: 'Preuve à reprendre',
      etape: 'Rejetée', dateSoumission: '2026-02-20', dateValidation: '2026-03-05' },
    { id: 6, annee: '2027', mission: 'M-2027-003', typeMission: 'Inspection', poste: "Recette des Finances d'Abengourou",
      irt: "Antenne Régionale d'Abengourou", localite: 'Abengourou', constat: 'Absence de coffre-fort',
      cause: 'Budget insuffisant', libelle: 'Acquérir un coffre-fort', objectif: 'Sécuriser les valeurs',
      processus: 'PS1', famille: 'Sécurité', sousFamille: '7.1 Coffre-fort', pilote: 'DMG', attributaire: 'DMG_DGTCP',
      dateDebut: '2027-01-15', dateFin: '2027-04-30', preuve: 'Facture et photo du coffre-fort', observation: '',
      etape: 'À mettre en œuvre', dateSoumission: '2027-01-10', dateValidation: '2027-01-12' },
    { id: 7, annee: '2027', mission: 'M-2027-003', typeMission: 'Inspection', poste: "Recette des Finances d'Abengourou",
      irt: "Antenne Régionale d'Abengourou", localite: 'Abengourou', constat: 'Budget non transmis',
      cause: 'Oubli de transmission', libelle: 'Transmettre le budget', objectif: 'Respecter le calendrier budgétaire',
      processus: 'PR6', famille: 'Comptabilité', sousFamille: '2.3 Gestion budgétaire', pilote: 'ACCT', attributaire: 'ACCT',
      dateDebut: '2027-02-10', dateFin: '2027-03-31', preuve: 'Accusé de réception du budget', observation: '',
      etape: 'À soumettre', dateSoumission: null, dateValidation: null },
    { id: 8, annee: '2027', mission: 'M-2027-009', typeMission: 'Inspection', poste: 'Trésorerie Générale de San-Pedro',
      irt: 'Antenne Régionale San-Pedro', localite: 'San-Pedro', constat: 'Besoin de réhabilitation des locaux',
      cause: 'Locaux vétustes', libelle: 'Réhabiliter les locaux', objectif: 'Améliorer les conditions de travail',
      processus: 'PS1', famille: 'Locaux', sousFamille: '4.2 Réhabilitation', pilote: 'DMG', attributaire: 'DMG_DGTCP',
      dateDebut: '2027-04-01', dateFin: '2027-12-31', preuve: 'Procès-verbal de réception', observation: '',
      etape: 'À soumettre', dateSoumission: null, dateValidation: null },
    { id: 9, annee: '2027', mission: 'A-2027-001', typeMission: 'Audit', poste: 'Direction des Ressources Humaines',
      irt: "Division de l'Audit Interne (DAI)", localite: 'Abidjan', constat: 'Fiches de poste absentes',
      cause: 'Organigramme non mis à jour', libelle: 'Élaborer les fiches de poste', objectif: 'Clarifier les responsabilités',
      processus: 'PS2', famille: 'Managérial', sousFamille: '5.1 Personnel', pilote: 'DRH', attributaire: 'DRH_DGTCP',
      dateDebut: '2027-02-01', dateFin: '2027-06-30', preuve: 'Fiches de poste signées', observation: '',
      etape: 'À mettre en œuvre', dateSoumission: '2027-01-25', dateValidation: '2027-02-02' },
  ]);

  filtres = signal({ ...FILTRES_VIDES });
  etatActif = signal('toutes');

  setFiltre(cle: string, e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    this.filtres.update(f => ({ ...f, [cle]: v }));
  }

  reinitialiser() {
    this.filtres.set({ ...FILTRES_VIDES });
  }

  choisirEtat(id: string) {
    this.etatActif.set(id);
  }

  imprimer() {
    window.print();
  }

  // Modal « Détails »
  voir(r: Reco) {
    this.detail.set(r);
    this.modal().nativeElement.showModal();
  }

  fermer() {
    this.modal().nativeElement.close();
  }

  clicFond(e: MouseEvent) {
    if (e.target === this.modal().nativeElement) this.fermer();
  }

  // --- règles métier ---
  // Niveau d'exécution du cahier des charges : Réalisé / En cours / Non démarré
  niveau(r: Reco): string {
    switch (r.etape) {
      case 'Validée': return 'Réalisé';
      case 'Exécutée':
      case 'Rejetée': return 'En cours';
      case 'À mettre en œuvre': return new Date(r.dateDebut) <= new Date() ? 'En cours' : 'Non démarré';
      default: return 'Non démarré';
    }
  }

  echue(r: Reco): boolean {
    return this.niveau(r) !== 'Réalisé' && new Date(r.dateFin) < new Date();
  }

  // Validation attendue en 5 jours maximum
  horsDelai(r: Reco): boolean {
    if (!r.dateSoumission || !r.dateValidation) return false;
    const jours = (new Date(r.dateValidation).getTime() - new Date(r.dateSoumission).getTime()) / 86400000;
    return jours > 5;
  }

  libProc(code: string): string {
    const p = PROCESSUS.find(x => x.code === code);
    return p ? `${p.code} : ${p.lib}` : code;
  }

  // --- filtres ---
  filtrees = computed(() => {
    const f = this.filtres();
    return this.recos().filter(r => {
      if (f.annee && r.annee !== f.annee) return false;
      if (f.trimestre && Math.ceil((new Date(r.dateDebut).getMonth() + 1) / 3) !== Number(f.trimestre)) return false;
      if (f.typeMission && r.typeMission !== f.typeMission) return false;
      if (f.processus && r.processus !== f.processus) return false;
      if (f.famille && r.famille !== f.famille) return false;
      if (f.irt && r.irt !== f.irt) return false;
      if (f.niveau && this.niveau(r) !== f.niveau) return false;
      if (f.etape && r.etape !== f.etape) return false;
      return true;
    });
  });

  private selonEtat(id: string, r: Reco): boolean {
    switch (id) {
      case 'echues': return this.echue(r);
      case 'encours': return this.niveau(r) === 'En cours';
      case 'nondemarrees': return this.niveau(r) === 'Non démarré';
      case 'nonvalidees': return r.dateValidation === null;
      case 'horsdelai': return this.horsDelai(r);
      default: return true;
    }
  }

  compte(id: string): number {
    return this.filtrees().filter(r => this.selonEtat(id, r)).length;
  }

  vue = computed(() => this.filtrees().filter(r => this.selonEtat(this.etatActif(), r)));

  // --- statistiques ---
  stats(l: Reco[]) {
    const emises = l.length;
    const realisees = l.filter(r => this.niveau(r) === 'Réalisé').length;
    return {
      emises,
      echues: l.filter(r => this.echue(r)).length,
      realisees,
      enCours: l.filter(r => this.niveau(r) === 'En cours').length,
      nonRealisees: l.filter(r => this.niveau(r) === 'Non démarré').length,
      taux: emises ? Math.round((realisees * 100) / emises) : 0,
    };
  }

  total = computed(() => this.stats(this.filtrees()));

  // Annexe 6 : par antenne, avec « Année en cours / Années antérieures / Sous-total »
  lignesIrt = computed(() => {
    const l = this.filtrees();
    const ec = this.anneeEnCours;
    const nbMissions = (x: Reco[]) => new Set(x.map(r => r.mission)).size;
    const out: any[] = [];
    for (const irt of this.irts) {
      const sub = l.filter(r => r.irt === irt);
      const cur = sub.filter(r => r.annee === ec);
      const old = sub.filter(r => r.annee !== ec);
      out.push({ type: 'titre', libelle: irt });
      out.push({ type: 'ligne', libelle: 'Année en cours', missions: nbMissions(cur), ...this.stats(cur) });
      out.push({ type: 'ligne', libelle: 'Années antérieures', missions: nbMissions(old), ...this.stats(old) });
      out.push({ type: 'sous', libelle: 'Sous-total', missions: nbMissions(sub), ...this.stats(sub) });
    }
    const cur = l.filter(r => r.annee === ec);
    const old = l.filter(r => r.annee !== ec);
    out.push({ type: 'total', libelle: 'Total année en cours', missions: nbMissions(cur), ...this.stats(cur) });
    out.push({ type: 'total', libelle: 'Total années antérieures', missions: nbMissions(old), ...this.stats(old) });
    out.push({ type: 'total', libelle: 'TOTAL GÉNÉRAL', missions: nbMissions(l), ...this.stats(l) });
    return out;
  });

  // Annexe 7 : par processus
  lignesProcessus = computed(() => {
    const l = this.filtrees();
    const out: any[] = [];
    for (const g of GROUPES) {
      for (const p of PROCESSUS.filter(x => x.code.startsWith(g.prefixe))) {
        out.push({ type: 'ligne', libelle: `${p.code} : ${p.lib}`, ...this.stats(l.filter(r => r.processus === p.code)) });
      }
      out.push({ type: 'sous', libelle: `Sous-total processus ${g.nom}`, ...this.stats(l.filter(r => r.processus.startsWith(g.prefixe))) });
    }
    out.push({ type: 'total', libelle: 'TOTAL GÉNÉRAL', ...this.stats(l) });
    return out;
  });
}
