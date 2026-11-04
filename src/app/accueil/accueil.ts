import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Mission {
  ref: string;
  annee: number;
  type: 'Audit' | 'Inspection' | 'Mission';
  structure: string;
  statut: 'En cours' | 'Terminée' | 'Planifiée';
}

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil {
  annees = [2026, 2025, 2024, 2023];
  anneeChoisie = 2026;
  typeChoisi = 'Tous';


  missions: Mission[] = [
    { ref: 'M-001', annee: 2026, type: 'Audit', structure: 'Trésorerie générale', statut: 'En cours' },
    { ref: 'M-002', annee: 2026, type: 'Inspection', structure: 'Recette des finances', statut: 'Planifiée' },
    { ref: 'M-003', annee: 2026, type: 'Mission', structure: 'Paierie', statut: 'Terminée' },
    { ref: 'M-004', annee: 2025, type: 'Audit', structure: 'Direction régionale', statut: 'Terminée' },
    { ref: 'M-005', annee: 2025, type: 'Inspection', structure: 'Trésorerie générale', statut: 'Terminée' },
    { ref: 'M-006', annee: 2024, type: 'Mission', structure: 'Recette des finances', statut: 'Terminée' },
  ];

  constructor(private router: Router) {}

  get missionsFiltrees(): Mission[] {
    return this.missions.filter(m =>
      m.annee === +this.anneeChoisie &&
      (this.typeChoisi === 'Tous' || m.type === this.typeChoisi)
    );
  }

  compter(type: string): number {
    return this.missions.filter(m => m.annee === +this.anneeChoisie && m.type === type).length;
  }

  get enCours(): number {
    return this.missions.filter(m => m.annee === +this.anneeChoisie && m.statut === 'En cours').length;
  }

  deconnexion() {
    this.router.navigate(['/login']);
  }
}
