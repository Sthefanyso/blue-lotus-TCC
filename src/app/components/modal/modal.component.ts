import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [] // Adicione aqui os módulos necessários, se houver
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  show = false;

  close() {
    this.show = false;
  }
}