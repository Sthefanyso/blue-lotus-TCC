import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoverPasswordComponent {
  showModal = false;
  title = 'E-mail enviado';
  message = 'Um link para redefinir sua senha foi enviado para o endereço de e-mail informado.';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  openModal() {
    this.showModal = true;
    this.changeDetectorRef.detectChanges(); // Forçar atualização se necessário
  }

  closeModal() {
    this.showModal = false;
  }
}