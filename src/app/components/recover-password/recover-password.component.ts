import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
})
export class RecoverPasswordComponent implements OnInit{
  showModal: boolean = false;
  title: string = 'Recuperação de Senha';  // Título da tela inicial
  message: string = '';  // Mensagem que será exibida no modal
  imageUrl = '';
  userForm: FormGroup = new FormGroup({});

  constructor(private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }


  initializeForm(){
  this.userForm = this.fb.group({
    email: ['', [Validators.required]],
  })}
  // Função para validação do formato do email
  // private isValidEmail(email: string): boolean {
  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //   return emailPattern.test(email);
  // }

  // Função chamada ao submeter o formulário
  recuperar() {
    this.openModal();
    this.authService.requestPasswordReset(this.userForm.value).subscribe(
    (response: any) => {
      this.message = 'Por favor, verifique seu e-mail para redefinir a senha';  // Mensagem de sucesso
      this.title = 'Instruções de Recuperação';  // Título do modal de sucesso
      this.imageUrl = 'assets/recover-password/img-success.svg';
      
    this.openModal();  // Abre o modal com a mensagem correspondente
    }, (error: any) => {
      this.message = 'O e-mail fornecido é inválido. Por favor, verifique e tente novamente';  // Mensagem de erro
      this.title = 'Erro na Recuperação';  // Título do modal de erro
      this.imageUrl = 'assets/recover-password/img-error.svg';
      
    this.openModal();  // Abre o modal com a mensagem correspondente
    },
   ) }

  // Função para abrir o modal
  openModal() {
    this.showModal = true;  // Torna o modal visível
  }

  // Função para fechar o modal
  closeModal() {
    this.showModal = false;  // Fecha o modal
  }
}
