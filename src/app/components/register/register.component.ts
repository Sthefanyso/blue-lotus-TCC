import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
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
      email: ['', [Validators.required, Validators.maxLength(250)]],
      birthDate: ['',],
      password1: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]],
      password2: ['', [Validators.required, this.passwordMatchValidator]],
      gender: ['', [Validators.required]],
    }
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

  passwordMatchValidator(): ValidatorFn{
    return (group: AbstractControl): ValidationErrors | null => {
      const value = group.value

      const password = group.get('password1')?.value;
      const confirmPassword = group.get('password2')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
  } 
  form = this.userForm.value;
  register(): void {
    this.authService.register(this.userForm.value).subscribe(
      (response: any) => {
        console.log('Login bem-sucedido', response);
        // Redirecionar o usuário ou armazenar o token
      },
    );
  }
}