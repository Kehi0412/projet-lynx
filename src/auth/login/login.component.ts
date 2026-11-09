import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type EtapeConnexion = 'matricule' | 'otp';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly codeDemo = '123456';
  private expirationOtp = 0;

  etape = signal<EtapeConnexion>('matricule');
  matricule = '';
  codeOtp = '';
  erreur = signal('');
  succes = signal(false);

  constructor(private router: Router) {}

  demanderCode() {
    if (!this.matricule.trim()) {
      this.erreur.set('Veuillez saisir votre matricule.');
      return;
    }

    this.erreur.set('');
    this.codeOtp = '';
    this.expirationOtp = Date.now() + 10 * 60 * 1000;
    this.etape.set('otp');
  }

  verifierCode() {
    if (Date.now() > this.expirationOtp) {
      this.erreur.set('Le code a expiré. Demandez un nouveau code.');
      return;
    }

    if (this.codeOtp !== this.codeDemo) {
      this.erreur.set('Code de vérification incorrect.');
      return;
    }

    this.erreur.set('');
    this.succes.set(true);
    setTimeout(() => this.router.navigate(['/accueil']), 1000);
  }

  renvoyerCode() {
    this.codeOtp = '';
    this.erreur.set('');
    this.expirationOtp = Date.now() + 10 * 60 * 1000;
  }

  retourAuMatricule() {
    this.etape.set('matricule');
    this.codeOtp = '';
    this.erreur.set('');
  }
}
