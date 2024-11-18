import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../modal/modal.component";



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';
    showModal: boolean = false;
  title: string = 'Falha no login';  // Título da tela inicial
  imageUrl = 'assets/recover-password/loading.svg';

  constructor(private location: Location, private authService: AuthService, private router: Router) {}

  voltar() {
    this.location.back();
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (res) => {
        console.log('Login bem-sucedido', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['chatbot']);
      },
      (error) => {
        console.error('Falha no login', error);
        this.message = 'Ocorreu um erro desconhecido. Por favor, tente novamente.';
        this.openModal();
        if (error.status === 401) {
           this.message = 'E-mail ou usuário incorreto. Tente novamente.';
         } else if (error.status === 500) {
           this.message = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
         }
      }
    );
    
  }


  openModal() {
    this.showModal = true;  // Fecha o modal
}
}
