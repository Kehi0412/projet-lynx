import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {signal} from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  matricule = '';
  password = '';
  erreur=signal('');
  succes ='signal(false)';

  constructor(private router: Router) {}

  seConnecter() {

    if (this.matricule==='123456' && this.password==='tresor') {
      this.erreur.set('');
      this.succes.set(true);
       setTimeout(()=>this.router.navigate(['/accueil'])1500);
      }  else {
        this.erreur.set('matricule ou mot de passe incorrect');
        setTimeout(() => this.erreur.set(''),3000);
      }

  }
}



