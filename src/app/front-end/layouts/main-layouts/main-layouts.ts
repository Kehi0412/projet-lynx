import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PARAMS } from '../../../parametre/parametre';
imports: [RouterLink, RouterLinkActive, RouterOutlet];

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-main-layouts',
  styleUrl: './main-layouts.css',
  templateUrl: './main-layouts.html',
})
export class MainLayouts {
  readonly profil = 'ADMINISTRATEUR';
  readonly poste = 'Direction des Systemes Informatiques et Numerique';
  readonly parametres = PARAMS;
  readonly parametresOuverts = signal(false);
  readonly moduleActif = signal('annee');

  constructor(private router: Router, route: ActivatedRoute) {
    route.queryParamMap.subscribe((queryParams) => {
      const module = queryParams.get('module');
      if (module && this.parametres.some((parametre) => parametre.id === module)) {
        this.moduleActif.set(module);
        this.parametresOuverts.set(true);
      }
    });
  }

  basculerParametres() {
    this.parametresOuverts.update((ouvert) => !ouvert);
  }

  choisirParametre(id: string) {
    this.moduleActif.set(id);
    this.parametresOuverts.set(true);
    this.router.navigate(['/home/parametres'], { queryParams: { module: id } });
  }

  deconnexion() {
    this.router.navigate(['/login']);
  }
}
