import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService
  ) {}

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        window.location.replace('#/resumen/home');
        window.location.reload();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed:',
          detail: this.errorMessage,
        });
      }
    );
  }

  mostrarBtn() {
    const pass_field = document.querySelector('.pass__key');
    const showBtn = document.querySelector('.show');
    if (pass_field.getAttribute('type') === 'password') {
      pass_field.setAttribute('type', 'text');
      showBtn.textContent = 'Ocultar';
    } else {
      pass_field.setAttribute('type', 'password');
      showBtn.textContent = 'Mostrar';
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }
}
