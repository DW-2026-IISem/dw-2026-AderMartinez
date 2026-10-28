import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  identifier = '';
  password = '';
  errorMessage = '';

  onSubmit() {
    this.errorMessage = '';
    this.authService.login({ identifier: this.identifier, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']); // Ir al inicio
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
      }
    });
  }
}