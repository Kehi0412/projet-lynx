import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  erreur='';

  constructor(private router: Router) {}

  seConnecter() {

    if (this.matricule==='123456' && this.password==='tresor') {
      this.erreur='';
      alert("Connexion reussie!");
       this.router.navigate(['/accueil']);
      }  else {
        this.erreur='matricule ou mot de passe incorrect';
        setTimeout(() =>{
          this.erreur='';
      },3000);

  }
}
}


