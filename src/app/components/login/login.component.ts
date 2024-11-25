import { Component} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../modal/modal.component";
import { ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ModalComponent, ReactiveFormsModule, CommonModule],
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
 
    constructor(private location: Location, private authService: AuthService, private router: Router) {
      
    }
  
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
          this.message='Não foi possível autenticar. Verifique e-mail e senha.'
          this.openModal();
        }
      );
    }

  

  openModal() {
    this.showModal = true;  // Fecha o modal
}
}
