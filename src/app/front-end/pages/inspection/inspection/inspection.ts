import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface InspectionRecord {
  id: number;
  reference: string;
  annee: number;
  poste: string;
  chefMission: string;
  dateDebut: string;
  dateFin: string;
  statut: 'En cours' | 'Terminée' | 'Planifiée';
}

@Component({
  imports: [DatePipe, FormsModule],
  selector: 'app-inspection',
  styleUrl: './inspection.css',
  templateUrl: './inspection.html',
})
export class Inspection {
  readonly annees = [2026, 2025, 2024, 2023];
  anneeChoisie = 2026;
  recherche = '';
  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');

  readonly inspections = signal<InspectionRecord[]>([
    {
      id: 1,
      reference: 'INS-2026-001',
      annee: 2026,
      poste: 'Trésorerie générale de Bouaké',
      chefMission: 'Chef de mission',
      dateDebut: '2026-06-01',
      dateFin: '2026-09-30',
      statut: 'En cours',
    },
    {
      id: 2,
      reference: 'INS-2026-002',
      annee: 2026,
      poste: 'Recette des finances',
      chefMission: 'Équipe d’inspection',
      dateDebut: '2026-10-12',
      dateFin: '2026-10-23',
      statut: 'Planifiée',
    },
    {
      id: 3,
      reference: 'INS-2025-006',
      annee: 2025,
      poste: 'Direction régionale',
      chefMission: 'Chef de mission',
      dateDebut: '2025-03-10',
      dateFin: '2025-04-04',
      statut: 'Terminée',
    },
  ]);

  nouvelleInspection = this.formulaireVide();
  erreurDate = signal('');

  get inspectionsFiltrees(): InspectionRecord[] {
    const recherche = this.recherche.trim().toLocaleLowerCase();
    return this.inspections().filter(
      (inspection) =>
        inspection.annee === Number(this.anneeChoisie) &&
        (!recherche ||
          inspection.reference.toLocaleLowerCase().includes(recherche) ||
          inspection.poste.toLocaleLowerCase().includes(recherche)),
    );
  }

  ouvrir() {
    this.nouvelleInspection = this.formulaireVide();
    this.erreurDate.set('');
    this.modal().nativeElement.showModal();
  }

  fermer() {
    this.modal().nativeElement.close();
  }

  enregistrer(formulaire: NgForm) {
    if (formulaire.invalid) {
      formulaire.form.markAllAsTouched();
      return;
    }

    if (this.nouvelleInspection.dateFin < this.nouvelleInspection.dateDebut) {
      this.erreurDate.set('La date de fin doit être postérieure à la date de début.');
      return;
    }

    const id = Math.max(0, ...this.inspections().map((inspection) => inspection.id)) + 1;
    this.inspections.update((inspections) => [
      ...inspections,
      {
        id,
        ...this.nouvelleInspection,
        annee: new Date(this.nouvelleInspection.dateDebut).getFullYear(),
        statut: 'Planifiée',
      },
    ]);
    this.anneeChoisie = new Date(this.nouvelleInspection.dateDebut).getFullYear();
    this.fermer();
  }

  supprimer(id: number) {
    if (!window.confirm('Confirmer la suppression de cette mission d’inspection ?')) return;
    this.inspections.update((inspections) => inspections.filter((inspection) => inspection.id !== id));
  }

  clicFond(event: MouseEvent) {
    if (event.target === this.modal().nativeElement) this.fermer();
  }

  private formulaireVide() {
    return {
      reference: '',
      poste: '',
      chefMission: '',
      dateDebut: '',
      dateFin: '',
    };
  }
}
