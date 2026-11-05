import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PARAM_CONFIGS, ParamConfig } from './parametre.model';
import { ParametreService } from './parametre.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-parametre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametre.html',
  styleUrl: './parametre.css',
})
export class Parametre {
  configs = PARAM_CONFIGS;
  active: ParamConfig = PARAM_CONFIGS[0];
  form: any = {};

  constructor(private svc: ParametreService,
  private modalService: BsModalService) {}
  modalRef?: BsModalRef;


  openModalWithClass(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  }
  get rows() {
    return this.svc.list(this.active.key);
  }

  select(c: ParamConfig) {
    this.active = c;
    this.form = {};
  }
  edit(row: any) {
    this.form = { ...row };
  }
  reset() {
    this.form = {};
    if (this.fileInput) this.fileInput.nativeElement.value = '';

  }

  save() {
    this.svc.save(this.active.key, this.active.id, this.form);
    this.reset();
  }

  remove(row: any) {
    if (confirm('Supprimer cet élément ?')) {
      this.svc.remove(this.active.key, this.active.id, row[this.active.id]);
    }
  }
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const dot = file.name.lastIndexOf('.');
    this.form.nm_fich = dot > 0 ? file.name.substring(0, dot) : file.name;
    this.form.ext_fich = dot > 0 ? file.name.substring(dot + 1).toLowerCase() : '';
    this.form.taille = file.size;

    const reader = new FileReader();
    reader.onload = () => (this.form.contenu = reader.result as string);
    reader.readAsDataURL(file);
  }

  download(row: any) {
    const a = document.createElement('a');
    a.href = row.contenu;
    a.download = `${row.nm_fich}.${row.ext_fich}`;
    a.click();
  }
}
