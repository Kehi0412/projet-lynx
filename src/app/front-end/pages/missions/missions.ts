import { Component, ElementRef, signal, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

export interface Mission {
  Cod_miss: string;
  Loc_miss: string;
  D_db_miss: string;
  D_fin_miss: string;
  Stru_contr_miss: string;
  Chf_pste_miss: string;
  Ma_chf_pste_miss: string;
  Obj_miss: string;
}

// La date de fin doit être après la date de début
function datesValides(g: AbstractControl): ValidationErrors | null {
  const d1 = g.get('D_db_miss')?.value;
  const d2 = g.get('D_fin_miss')?.value;
  return d1 && d2 && d2 < d1 ? { datesInvalides: true } : null;
}

@Component({
  selector: 'app-missions',
  imports: [ReactiveFormsModule],
  templateUrl: './missions.html',
  styleUrl: './missions.css',
})
export class Missions {
  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  missions = signal<Mission[]>([]);

  form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group(
      {
        Cod_miss: ['', Validators.required],
        Loc_miss: ['', Validators.required],
        D_db_miss: ['', Validators.required],
        D_fin_miss: ['', Validators.required],
        Stru_contr_miss: ['', Validators.required],
        Chf_pste_miss: ['', Validators.required],
        Ma_chf_pste_miss: [''],
        Obj_miss: ['', Validators.required],
      },
      { validators: datesValides },
    );
  }

  ouvrir() {
    this.form.reset();
    this.modal().nativeElement.showModal();
  }

  fermer() {
    this.modal().nativeElement.close();
  }

  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.missions.update((l) => [...l, this.form.getRawValue()]);
    this.fermer();
  }

  // Ferme le modal si on clique sur le fond
  clicFond(e: MouseEvent) {
    if (e.target === this.modal().nativeElement) this.fermer();
  }
}
