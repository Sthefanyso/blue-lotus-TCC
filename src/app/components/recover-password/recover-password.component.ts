import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalComponent],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
})
export class RecoverPasswordComponent {
  showModal: boolean = false;
  title: string = 'Recuperação de Senha';  // Título da tela inicial
  message: string = 'Por favor, verifique seu e-mail para redefinir a senha';  // Mensagem que será exibida no modal
  imageUrl = 'assets/recover-password/loading.svg';
  email: string = '';  // Variável para armazenar o email informado pelo usuário

  constructor() {}

  // Função para validação do formato do email
  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Função chamada ao submeter o formulário
  onSubmit() {
    if (this.isValidEmail(this.email)) {
      this.message = 'Por favor, verifique seu e-mail para redefinir a senha';  // Mensagem de sucesso
      this.title = 'Instruções de Recuperação';  // Título do modal de sucesso
    } else {
      this.message = 'O e-mail fornecido é inválido. Por favor, verifique e tente novamente';  // Mensagem de erro
      this.title = 'Erro na Recuperação';  // Título do modal de erro
    }
    this.openModal();  // Abre o modal com a mensagem correspondente
  }

  // Função para abrir o modal
  openModal() {
    this.showModal = true;  // Torna o modal visível
  }

  // Função para fechar o modal
  closeModal() {
    this.showModal = false;  // Fecha o modal
  }
}
