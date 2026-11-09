import { Component, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [DatePipe, FormsModule],
  selector: 'app-parametre',
  styleUrl: './parametre.css',
  templateUrl: './parametre.html',
})
export class Parametre {
  protected active: any;
  protected modalRef: any;
  protected openModalWithClass(template: TemplateRef<any>) {}

  protected select(c: any): void {}
  protected download(r: any): void {}
  protected remove(r: any): void {}
  protected edit(r: any): void {}

  protected reset() {}

  protected form :any={};
  protected onFile($event: Event) {}

  protected save() {}
  protected() {}
}
