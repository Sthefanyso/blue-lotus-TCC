import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { IConfig } from 'ngx-mask';


const maskConfig: Partial<IConfig> = {
  validation: false,
};


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  userForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});


  constructor(private location: Location, private authService: AuthService, private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  voltar() {
    this.location.back();
  }

  initializeForm(){
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      surname: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(15), Validators.minLength(14)]],
      email: ['', [Validators.required,
        Validators.maxLength(250),
         Validators.minLength(5),
         Validators.email
         ]],
      
      gender: ['', [Validators.required]],
      birthDate: ['',]});

    this.passwordForm = new FormGroup({
      password1: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]),
      password2: new FormControl('', [Validators.required]),
    }, 
      
      [this.passwordMatchValidator('password1', 'password2')]
      );

      
  }

    passwordMatchValidator(controlName: string, ControlRepeat: string) : ValidatorFn {
      console.log('eits');
      
        return (control: AbstractControl): ValidationErrors | null => {
          const sourceCtrl = control.get(controlName);
          const targetCtrl = control.get(ControlRepeat);

          if(sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value){
            console.log('eita');
          }

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

      

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }
  
  register(): void {
    const formData = { ...this.userForm.value, ...this.passwordForm.value };

    this.authService.register(formData).subscribe(
      (response: any) => {
        console.log('Cadastro bem-sucedido', response);
        // Redirecionar o usuário ou armazenar o token
      },
    );
  }
}