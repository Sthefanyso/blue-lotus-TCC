import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Location, CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})

export class NewPasswordComponent implements OnInit{

  token: string = '';

  passwordForm: FormGroup = new FormGroup({});
  showModal: boolean = false;
  title: string = 'Redefinição de senha';  // Título da tela inicial
  message: string = '';  // Mensagem que será exibida no modal
  imageUrl = 'assets/recover-password/loading.svg';

  constructor(private route: ActivatedRoute, private location: Location, private router: Router, private authService: AuthService, private fb: FormBuilder) {    
    this.token = this.route.snapshot.params['token'];
  }

  voltar() {
    this.location.back();
  }


  ngOnInit() {
    this.initializeForm();
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      console.log('Token recebido:', this.token);
    });
  }


  initializeForm(){
      this.passwordForm = this.fb.group({
        password1: ['', [Validators.required, Validators.minLength(8)]],
        password2: ['', [Validators.required]]
      });
      
      this.passwordForm.setValidators(this.passwordMatchValidator('password1', 'password2'));

      
  }

    passwordMatchValidator(controlName: string, ControlRepeat: string) : ValidatorFn {
      
        return (control: AbstractControl): ValidationErrors | null => {
          const sourceCtrl = control.get(controlName);
          const targetCtrl = control.get(ControlRepeat);

          return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
            ? { mismatch: true }
            : null;
        };
      }

      get passwordMatchError() {
        return (
          this.passwordForm.getError('mismatch') && this.passwordForm.get('password2')
        );
      }

      onSubmit() {
        this.authService.resetPassword(this.token, this.passwordForm.get('password1')?.value).subscribe(
          (response: any) => {
            // Mensagem de sucesso
            this.message = 'Senha redefinida com sucesso!';
            this.openModal();
            this.router.navigate(['login']);
          },
          (error: any) => {
            // Verifica se a API retornou uma mensagem específica de erro
            if (error?.error?.message) {
              this.message = error.error.message;  // Exibe a mensagem de erro da API
            } else {
              this.message = 'Erro ao redefinir a senha.';  // Mensagem padrão se não houver erro específico
            }
            this.openModal();
          }
        );
      }

      openModal() {
        this.showModal = true;  // Fecha o modal
    }
    

}
