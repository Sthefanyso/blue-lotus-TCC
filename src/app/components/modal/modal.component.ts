import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [CommonModule] 
})


export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() show: boolean = false;

  close() {
    this.show = false;
  }
}