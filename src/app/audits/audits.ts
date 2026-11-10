import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Audit {
  id: number;
  auditeur: string;
  nomAudite: string;
  typeAudite: string;
  periodeDebut: string;
  periodeFin: string;
  livraisonAttendue: string;
  date: string;
}

@Component({
  selector: 'app-audits',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './audits.html',
  styleUrl: './audits.css',
})
export class Audits {
  typesAudit: string[] = [
    'Audit interne',
    'Audit externe',
    'Audit de conformité',
    'Audit financier',
    'Audit de performance',
  ];

  listeAudits: Audit[] = [];

  audit: Audit = this.creerAuditVide();

  message: string = '';
  erreur: string = '';

  // Créer un formulaire vide
  creerAuditVide(): Audit {
    return {
      id: 0,
      auditeur: '',
      nomAudite: '',
      typeAudite: '',
      periodeDebut: '',
      periodeFin: '',
      livraisonAttendue: '',
      date: '',
    };
  }

  // Afficher la liste des audits
  get audits(): Audit[] {
    return this.listeAudits;
  }

  // Ajouter un audit
  ajouter(): void {
    const a = this.audit;

    this.message = '';
    this.erreur = '';

    if (
      !a.auditeur ||
      !a.nomAudite ||
      !a.typeAudite ||
      !a.periodeDebut ||
      !a.periodeFin ||
      !a.livraisonAttendue ||
      !a.date
    ) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }

    if (a.periodeFin < a.periodeDebut) {
      this.erreur = 'La fin de période doit être après le début.';
      return;
    }

    const nouvelAudit: Audit = {
      ...a,
      id: Date.now(),
    };

    this.listeAudits.push(nouvelAudit);

    this.audit = this.creerAuditVide();

    this.message = 'Audit ajouté avec succès !';
  }

  // Supprimer un audit
  supprimer(id: number): void {
    this.listeAudits = this.listeAudits.filter((audit) => audit.id !== id);

    this.message = 'Audit supprimé avec succès !';
  }

  // Vider le formulaire
  vider(): void {
    this.audit = this.creerAuditVide();
    this.message = '';
    this.erreur = '';
  }
}
