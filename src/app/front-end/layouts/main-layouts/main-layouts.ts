import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-main-layouts',
  styleUrl: './main-layouts.css',
  templateUrl: './main-layouts.html',
})
export class MainLayouts {
  readonly profil = 'ADMINISTRATEUR';
  readonly poste = 'DIRECTION GÉNÉRALE DU TRÉSOR';

  constructor(private router: Router) {}

  deconnexion() {
    this.router.navigate(['/login']);
  }
}
