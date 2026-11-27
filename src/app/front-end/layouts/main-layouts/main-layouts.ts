import { Component, OnDestroy, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { PARAMS } from '../../../parametre/parametre';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-main-layouts',
  styleUrl: './main-layouts.css',
  templateUrl: './main-layouts.html',
})
export class MainLayouts implements OnDestroy {
  readonly profil = 'ADMINISTRATEUR';
  readonly poste: string = "Direction du Systeme D'information Numerique";
  readonly parametres = PARAMS;
  readonly parametresOuverts = signal(false);
  readonly moduleActif = signal('annee');

  readonly missionOuvert = signal(false);
  readonly inspectionOuvert = signal(false);
  readonly auditOuvert = signal(false);

  // Date et heure en temps réel (mises à jour chaque seconde)
  readonly maintenant = signal(new Date());
  private readonly horloge = setInterval(() => this.maintenant.set(new Date()), 1000);

  constructor(
    private router: Router,
    route: ActivatedRoute,
  ) {
    route.queryParamMap.subscribe((queryParams) => {
      const module = queryParams.get('module');
      if (module && this.parametres.some((parametre) => parametre.id === module)) {
        this.moduleActif.set(module);
        this.parametresOuverts.set(true);
      }
    });
  }

  dateAffichee() {
    return this.maintenant().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  heureAffichee() {
    return this.maintenant().toLocaleTimeString('fr-FR');
  }

  ngOnDestroy() {
    clearInterval(this.horloge); // arrête le minuteur quand on quitte la page
  }

  basculerParametres() {
    this.parametresOuverts.update((ouvert) => !ouvert);
  }

  basculerMission() {
    this.missionOuvert.update((ouvert) => !ouvert);
  }

  basculerInspection() {
    this.inspectionOuvert.update((ouvert) => !ouvert);
  }

  basculerAudit() {
    this.auditOuvert.update((ouvert) => !ouvert);
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
