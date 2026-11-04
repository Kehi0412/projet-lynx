import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { Accueil} from './accueil/accueil';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'accueil', component: Accueil},
];
