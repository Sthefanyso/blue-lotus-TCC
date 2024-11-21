import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../components/modal/modal.component';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  token: string = '';

  passwordForm: FormGroup = new FormGroup({});
  showModal: boolean = false;
  title: string = 'Falha no registro';  // Título da tela inicial
  message: string = '';  // Mensagem que será exibida no modal
  imageUrl = 'assets/recover-password/loading.svg';

  
  constructor(private route: ActivatedRoute, private location: Location, private authService: AuthService, private fb: FormBuilder
  ) {    this.token = this.route.snapshot.params['token'];
  }

  ngOnInit(): void {
    this.initializeForm();
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
        this.authService.resetPassword(this.token, this.passwordForm.value).subscribe(
          (response: any) => {
          this.openModal
          this.message = 'Senha redefinida com sucesso!'
          }, (error: any) => {
          this.message = 'Erro ao redefinir a senha.'
        });
      }

      openModal() {
        this.showModal = true;  // Fecha o modal
    }
    

}
