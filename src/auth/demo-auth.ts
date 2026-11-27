import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../app/environement/environment';

const MATRICULE = 'ADMIN001';
const MOT_DE_PASSE = 'Linx2026';

export function connexionDemo(matricule: string, motDePasse: string): boolean {
  if (matricule.trim().toUpperCase() === MATRICULE && motDePasse === MOT_DE_PASSE) {
    sessionStorage.setItem('linx_demo', '1');
    return true;
  }
  return false;
}

export function deconnexionDemo() {
  sessionStorage.removeItem('linx_demo');
  localStorage.removeItem('userData');
}

// Sans connexion, on est renvoyé vers la page de login
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const connecte = environment.modeDemo
    ? sessionStorage.getItem('linx_demo') === '1'
    : !!JSON.parse(localStorage.getItem('userData') ?? 'null')?.token;

  return connecte ? true : router.parseUrl('/login');
};
