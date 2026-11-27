import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../app/back-end/services/login';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../app/back-end/services/storage.service';
import { environment } from '../../app/environement/environment';
import { connexionDemo } from '../demo-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;
  afficherMdp = false;
  private storage = localStorage;
  loginForm = new FormGroup({
    matricule: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    motDePasse: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private loginService: Login,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
  ) {}

  visible = signal(false);
  erreur = signal('');
  succes = signal(false);
  survol = signal(false);

  connexion() {
    if (this.succes()) return;

    if (this.loginForm.invalid) {
      this.afficherErreur('Veuillez remplir tous les champs.');
      return;
    }

    const formData = this.loginForm.getRawValue();

    // ---------- MODE DÉMO : connexion locale, sans back-end ----------
    if (environment.modeDemo) {
      if (connexionDemo(formData.matricule, formData.motDePasse)) {
        // faux profil, pour les pages qui lisent "userData"
        this.storage.setItem(
          'userData',
          JSON.stringify({
            token: 'demo',
            matricule: formData.matricule,
            nom: 'Administrateur',
            profil: 'ADMINISTRATEUR',
          }),
        );
        this.erreur.set('');
        this.succes.set(true);
        setTimeout(() => this.router.navigate(['/home/accueil']));
      } else {
        this.afficherErreur('Matricule ou mot de passe incorrect.');
      }
      return;
    }

    // ---------- MODE NORMAL : connexion via le back-end ----------
    this.isLoading = true;

    const data = {
      matricule: formData.matricule,
      motDePasse: formData.motDePasse,
    };

    this.loginService.login(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.storage.setItem('userData', JSON.stringify(res));
        this.erreur.set('');
        this.succes.set(true);
        setTimeout(() => this.router.navigate(['/home/accueil']));
      },
      error: (error: any) => {
        this.isLoading = false;
        const errorMessage =
          typeof error === 'string' ? error : error?.error?.message || 'Erreur lors de la connexion';
        this.afficherErreur(errorMessage);
      },
    });
  }

  private minuteur: any;

  afficherErreur(msg: string) {
    this.erreur.set(msg);
    clearTimeout(this.minuteur);
    this.minuteur = setTimeout(() => this.erreur.set(''), 4000);
  }
}
