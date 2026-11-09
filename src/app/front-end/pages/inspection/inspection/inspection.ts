import { Component, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InspectionModel } from '../../../../back-end/models/inspection';
//import { ParametreService } from '../../../../parametre/parametre.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgIf } from '@angular/common';
interface Mission {
  ref: string;
  annee: number;
  type: 'Audit' | 'Inspection' | 'Mission';
  structure: string;
  statut: 'En cours' | 'Terminée' | 'Planifiée';
}
@Component({
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  selector: 'app-inspection',
  styleUrl: './inspection.css',
  templateUrl: './inspection.html',
})
export class Inspection {
  annees = [2026, 2025, 2024, 2023];
  anneeChoisie = 2026;
  typeChoisi = 'Tous';
  ind!: InspectionModel;
  constructor(
    //private svc: ParametreService,
    private modalService: BsModalService,
  ) {}
  modalRef?: BsModalRef;

  openModalWithClass(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  }
  missions: Mission[] = [
    {
      ref: 'M-001',
      annee: 2026,
      type: 'Audit',
      structure: 'Trésorerie générale',
      statut: 'En cours',
    },
    {
      ref: 'M-002',
      annee: 2026,
      type: 'Inspection',
      structure: 'Recette des finances',
      statut: 'Planifiée',
    },
    { ref: 'M-003', annee: 2026, type: 'Mission', structure: 'Paierie', statut: 'Terminée' },
    {
      ref: 'M-004',
      annee: 2025,
      type: 'Audit',
      structure: 'Direction régionale',
      statut: 'Terminée',
    },
    {
      ref: 'M-005',
      annee: 2025,
      type: 'Inspection',
      structure: 'Trésorerie générale',
      statut: 'Terminée',
    },
    {
      ref: 'M-006',
      annee: 2024,
      type: 'Mission',
      structure: 'Recette des finances',
      statut: 'Terminée',
    },
  ];

  get missionsFiltrees(): Mission[] {
    return this.missions.filter(
      (m) =>
        m.annee === +this.anneeChoisie &&
        (this.typeChoisi === 'Tous' || m.type === this.typeChoisi),
    );
  }

  compter(type: string): number {
    return this.missions.filter((m) => m.annee === +this.anneeChoisie && m.type === type).length;
  }

  get enCours(): number {
    return this.missions.filter((m) => m.annee === +this.anneeChoisie && m.statut === 'En cours')
      .length;
  }
}
