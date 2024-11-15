import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() show: boolean = false;  // Controla a visibilidade do modal
  @Input() imageUrl: string ='';


  close() {
    this.show = false;  // Fecha o modal alterando o valor de show
  }
}
