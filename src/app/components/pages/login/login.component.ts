import { Component } from '@angular/core';
import { LoginRequest } from '../../../interfaces/login-request.interface';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/auth/login.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isValid: boolean = false;
  passHide: boolean = true;
  isLoading: boolean = false;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  errorEmailMessage = '';
  errorPassMessage = '';

  fgLogin: any;

  constructor(private fBuild: FormBuilder, private router: Router, private loginSrv: LoginService) {
    this.fgLogin = this.fBuild.group({
      email: this.email,
      password: this.password
    });

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePassErrorMessage());
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required'))
      this.errorEmailMessage = 'El email no puede quedar vacío';
    else
      this.errorEmailMessage = 'Email no válido';
  }

  updatePassErrorMessage() {
    if (this.password.hasError('required'))
      this.errorPassMessage = 'La contraseña no puede quedar vacía';
    else
      this.errorPassMessage = 'Contraseña no válida';
  }

  togglePasswordVisibility() {
    this.passHide = !this.passHide;
  }
  

  doLogin() {
    if (this.fgLogin.invalid) {
      return;
    }
    this.isLoading = true;
    var res = false;
    this.loginSrv.login(this.fgLogin.value as LoginRequest).subscribe({
      next: () => {
        this.isLoading = false;
        res = true;
        this.fgLogin.reset();
        this.fgLogin.markAsUntouched();
        this.router.navigateByUrl("/index");
      },
      error: () => {
        this.isLoading = false;
        res = true;
      },
    });
  }
}
