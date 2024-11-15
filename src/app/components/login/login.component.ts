import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor( private authService: AuthService) {}

   login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login bem-sucedido', response);
        // Redirecionar o usuário ou armazenar o token
      },
      (error) => {
        console.error('Falha no login', error);
      }
    );
  }
}
