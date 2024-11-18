import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';

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
      }
    );
  }
}
