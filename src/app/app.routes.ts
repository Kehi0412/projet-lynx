import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { Accueil } from './accueil/accueil';
import { Parametre } from './parametre/parametre';
import { AuthLayouts } from './front-end/layouts/auth-layouts/auth-layouts';
import { MainLayouts } from './front-end/layouts/main-layouts/main-layouts';
import { Missions } from './front-end/pages/missions/missions';
import { Inspection } from './front-end/pages/inspection/inspection/inspection';
import { Rapport } from './front-end/pages/rapports/rapport/rapport';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayouts,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: '',
    component: MainLayouts,
    children: [
      { path: '', component: Accueil },
      { path: 'accueil', component: Accueil },
      { path: 'parametres', component: Parametre },
      { path: 'mission', component: Missions },
      { path: 'inspection', component: Inspection },
      { path: 'rapport', component: Rapport },
    ],
  },
];
