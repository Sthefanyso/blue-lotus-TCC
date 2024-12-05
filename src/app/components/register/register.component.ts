import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { IConfig } from 'ngx-mask';
import { ModalComponent } from '../modal/modal.component';
import { Router } from '@angular/router';




const maskConfig: Partial<IConfig> = {
  validation: false,
};


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  userForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});
  termosChecked: boolean = false;
  showModal: boolean = false;
  title: string = 'Falha no registro';  // Título da tela inicial
  message: string = '';  // Mensagem que será exibida no modal
  imageUrl = 'assets/recover-password/loading.svg';

  constructor(private location: Location, private authService: AuthService, private fb: FormBuilder, private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  voltar() {
    this.location.back();
  }

  toggleTermos(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.termosChecked = checkbox.checked;
}

  initializeForm(){
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      surname: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(11), Validators.minLength(10)]],
      email: ['', [Validators.required,
        Validators.maxLength(250),
         Validators.minLength(5),
         Validators.email
         ]],
      
      gender: [''],
      birthDate: ['2000-01-01']
});

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





  register(): void {
    const formData = { ...this.userForm.value, ...this.passwordForm.value };

    this.authService.register(formData).subscribe(
      (response: any) => {
        console.log('Cadastro bem-sucedido', response);
        this.router.navigate(['login']);

      },

      (error: any) => {
        this.openModal();
      console.error('Erro ao registrar', error);
        
      this.message = 'Ocorreu um erro desconhecido. Por favor, tente novamente.';
  
        if (error.status === 400) {
           this.message = 'Este e-mail já está em uso. Tente usar outro.';
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