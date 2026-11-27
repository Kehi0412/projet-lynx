
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MissionAudit {
  id: number;
  reference: string;
  intitule: string;
  typeMission: string;
  service: string;
  responsable: string;
  dateDebut: string;
  dateFin: string;
  objectif: string;
  statut: string;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent implements OnInit {

  missions: MissionAudit[] = [];

  afficherFormulaire = false;
  missionEnModification: number | null = null;
  missionSelectionnee: MissionAudit | null = null;

  nouvelleMission: MissionAudit = this.formulaireVide();

  ngOnInit(): void {
    this.chargerMissions();
  }

  formulaireVide(): MissionAudit {
    return {
      id: 0,
      reference: '',
      intitule: '',
      typeMission: 'Audit interne',
      service: '',
      responsable: '',
      dateDebut: '',
      dateFin: '',
      objectif: '',
      statut: 'En attente'
    };
  }

  chargerMissions(): void {
    const donnees = localStorage.getItem('missions_audit');

    if (donnees) {
      this.missions = JSON.parse(donnees);
    }
  }

  sauvegarderMissions(): void {
    localStorage.setItem(
      'missions_audit',
      JSON.stringify(this.missions)
    );
  }

  ouvrirFormulaire(): void {
    this.nouvelleMission = this.formulaireVide();
    this.missionEnModification = null;
    this.missionSelectionnee = null;
    this.afficherFormulaire = true;
  }

  enregistrerMission(): void {
    if (
      !this.nouvelleMission.reference.trim() ||
      !this.nouvelleMission.intitule.trim() ||
      !this.nouvelleMission.service.trim() ||
      !this.nouvelleMission.dateDebut ||
      !this.nouvelleMission.dateFin
    ) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    if (this.nouvelleMission.dateFin < this.nouvelleMission.dateDebut) {
      alert('La date de fin doit être après la date de début.');
      return;
    }

    if (this.missionEnModification !== null) {
      const index = this.missions.findIndex(
        m => m.id === this.missionEnModification
      );

      if (index !== -1) {
        this.missions[index] = {
          ...this.nouvelleMission,
          id: this.missionEnModification
        };
      }
    } else {
      const existe = this.missions.some(
        m => m.reference === this.nouvelleMission.reference
      );

      if (existe) {
        alert('Cette référence existe déjà.');
        return;
      }

      this.missions.push({
        ...this.nouvelleMission,
        id: Date.now()
      });
    }

    this.sauvegarderMissions();
    this.annulerFormulaire();
  }

  modifierMission(mission: MissionAudit): void {
    this.nouvelleMission = { ...mission };
    this.missionEnModification = mission.id;
    this.afficherFormulaire = true;
    this.missionSelectionnee = null;
  }

  supprimerMission(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette mission ?')) {
      this.missions = this.missions.filter(m => m.id !== id);
      this.sauvegarderMissions();
      this.missionSelectionnee = null;
    }
  }

  consulterMission(mission: MissionAudit): void {
    this.missionSelectionnee = mission;
    this.afficherFormulaire = false;
  }

  annulerFormulaire(): void {
    this.afficherFormulaire = false;
    this.missionEnModification = null;
    this.nouvelleMission = this.formulaireVide();
  }

  get totalMissions(): number {
    return this.missions.length;
  }

  get missionsEnCours(): number {
    return this.missions.filter(
      m => m.statut === 'En cours'
    ).length;
  }

  get missionsTerminees(): number {
    return this.missions.filter(
      m => m.statut === 'Terminée'
    ).length;
  }
}
