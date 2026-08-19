import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Validamos la estructura global (success y que exista data o token)
        if (response && response.success) {
          // Extraemos el token ya sea que venga dentro de response.data o directamente en response.data.token
          const token = response.data?.token || response.data;

          if (token) {
            this.authService.iniciarSesion(token);
            this.toastr.success(response.message || 'Inicio de sesión exitoso', 'Éxito');
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.error('No se encontró el token de acceso', 'Error');
          }
        } else {
          this.toastr.error(response.message || 'Credenciales inválidas', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al iniciar sesión', 'Error');
      }
    });
  }
}