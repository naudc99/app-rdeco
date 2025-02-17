import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from '../../../interfaces/register-request.interface';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginService } from '../../../services/auth/login.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../../services/auth/register.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatIcon, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  names: string[] = [];
  isValid: boolean = false;
  passHide: boolean = true;
  isLoading: boolean = false; 

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(30),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#ñÑ])[A-Za-z\\d@$!%*?&#ñÑ]{8,}$'
    ),
    Validators.minLength(8),
    Validators.maxLength(30),
  ]);

  errorNameMessage = '';
  errorEmailMessage = '';
  errorPassMessage = '';

  fgRegister: FormGroup;

  constructor(
    private fBuild: FormBuilder,
    private registerSrv: RegisterService,
    private router: Router,
    private loginSrv: LoginService
  ) {
    this.fgRegister = this.fBuild.group({
      name: this.name,
      email: this.email,
      password: this.password,
    });

    merge(this.name.statusChanges, this.name.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateNameErrorMessage());

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePassErrorMessage());
  }

  ngOnInit(): void {
    this.loginSrv.getAllUserNames().subscribe(names => {
      if (names) {
        this.names = names.map(a => a.toLocaleLowerCase());
      } else {
        this.names = [];
      }
    });
  }

  updateNameErrorMessage() {
    if (this.name.hasError('required'))
      this.errorNameMessage = 'El nombre no puede quedar vacío';
    else if (this.name.hasError('minlength'))
      this.errorNameMessage = 'Nombre demasiado corto';
    else if (this.name.hasError('maxlength'))
      this.errorNameMessage = 'Nombre demasiado largo';
    else if (this.name.hasError('forbiddenValue'))
      this.errorNameMessage = 'Nombre de usuario no disponible';
    else this.errorNameMessage = 'Nombre no válido';
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required'))
      this.errorEmailMessage = 'El email no puede quedar vacío';
    else if (this.email.hasError('maxlength'))
      this.errorEmailMessage = 'Email demasiado largo';
    else this.errorEmailMessage = 'Email no válido';
  }

  updatePassErrorMessage() {
    if (this.password.hasError('required'))
      this.errorPassMessage = 'La contraseña no puede quedar vacía';
    else if (this.password.hasError('minlength'))
      this.errorPassMessage = 'Contraseña demasiado corta';
    else if (this.password.hasError('maxlength'))
      this.errorPassMessage = 'Contraseña demasiado larga';
    else this.errorPassMessage = 'Contraseña no válida';
  }

  togglePasswordVisibility() {
    this.passHide = !this.passHide;
  }

  doRegister() {
    if (this.fgRegister.invalid) {
      return;
    }

    this.isLoading = true; 

    this.registerSrv.register(this.fgRegister.value as RegisterRequest).subscribe({
      next: () => {
        this.isLoading = false;
        this.fgRegister.reset();
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.isLoading = false; 
        // Manejo de errores aquí
      },
    });
  }
}
