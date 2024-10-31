import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  constructor(private location: Location) {}

  voltar() {
    this.location.back();
  }
}
