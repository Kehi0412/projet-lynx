import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../app/back-end/services/login';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../app/back-end/services/storage.service';

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
  /*  connexion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    this.isLoading = true;

    const formData = this.loginForm.getRawValue();
    const data = {
      matricule: formData.matricule,
      motDePasse: formData.motDePasse,
    };

    this.loginService.login(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.isLoading = false;

        if (res?.token) {
          localStorage.setItem('userData', JSON.stringify(res));
          this.toast.success('Connexion réussie');
          this.router.navigate(['/home/tableaudebord']);
        } else {
          this.toast.error('Problème de token');
          console.error('Structure de réponse inattendue:', res);
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        this.isLoading = false;
        console.error('Erreur de connexion:', error);
        this.toast.error(error.error?.message || 'Erreur lors de la connexion');
      },
    });
  }*/
  connexion() {


    if (this.succes()) return;

    if (this.loginForm.invalid) {
      this.afficherErreur('Veuillez remplir tous les champs.');
      return;
    }

    this.isLoading = true;

    const formData = this.loginForm.value;
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
        setTimeout(() => this.router.navigate(['/home/tableaudebord']), 1500);
      },
      error: (error: any) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Erreur lors de la connexion';
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
