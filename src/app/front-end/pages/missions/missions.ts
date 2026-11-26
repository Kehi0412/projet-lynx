import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export type TypeMission = 'INSPECTION' | 'AUDIT';

export interface Mission {
  id_miss: string;
  typeMission: TypeMission;
  Cod_miss: string;
  D_db_miss: string;
  D_fin_miss: string;
  Loc_miss: string;
  Stru_contr_miss: string;
  Ma_chf_pste_miss: string;
  Chf_pste_miss: string;
  Obj_miss: string;
  Créer_par: string;
  Crée_le: string;
  Modifier_par?: string | null;
  Modifier_le?: string | null;
  Supprimer?: boolean;
}

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './missions.html',
  styleUrl: './missions.css',
})
export class Missions {
  private fb = inject(FormBuilder);

  activeTab = signal<TypeMission>('INSPECTION');
  isAddModalOpen = signal(false);
  missions = signal<Mission[]>([]);

  filteredMissions = computed(() =>
    this.missions().filter((m) => m.typeMission === this.activeTab())
  );

  missionForm = this.fb.nonNullable.group({
    typeMission: ['INSPECTION' as TypeMission, Validators.required],
    Cod_miss: ['', Validators.required],
    D_db_miss: ['', Validators.required],
    D_fin_miss: ['', Validators.required],
    Loc_miss: ['', Validators.required],
    Stru_contr_miss: ['', Validators.required],
    Ma_chf_pste_miss: ['', Validators.required],
    Chf_pste_miss: ['', Validators.required],
    Obj_miss: ['', Validators.required],
  });

  selectTab(tab: TypeMission): void {
    this.activeTab.set(tab);
  }

  openAddModal(): void {
    this.missionForm.reset({
      typeMission: this.activeTab(),
      Cod_miss: '',
      D_db_miss: '',
      D_fin_miss: '',
      Loc_miss: '',
      Stru_contr_miss: '',
      Ma_chf_pste_miss: '',
      Chf_pste_miss: '',
      Obj_miss: '',
    });
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  submitMission(): void {
    if (this.missionForm.invalid) {
      this.missionForm.markAllAsTouched();
      return;
    }

    const raw = this.missionForm.getRawValue();
    const maintenant = new Date().toISOString();

    const nouvelleMission: Mission = {
      id_miss: crypto.randomUUID(),
      ...raw,
      Créer_par: 'Administrateur', // À remplacer par l'utilisateur connecté
      Crée_le: maintenant,
      Modifier_par: null,
      Modifier_le: null,
      Supprimer: false,
    };

    this.missions.update((list) => [nouvelleMission, ...list]);
    this.activeTab.set(raw.typeMission);
    this.closeAddModal();
  }
}
