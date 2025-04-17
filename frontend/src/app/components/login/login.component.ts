import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Login</h1>
        <p *ngIf="error" class="error-message">{{ error }}</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              class="form-control"
              [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
              Email is required
            </div>
            <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              class="form-control"
              [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>

          <p class="register-link">
            Don't have an account? <a routerLink="/register">Register here</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
      background: #f8f9fa;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;

      h1 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 2rem;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #2c3e50;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: #4169e1;
        }

        &.is-invalid {
          border-color: #dc3545;
        }
      }

      .invalid-feedback {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: #4169e1;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;

      &:hover:not(:disabled) {
        background: #2851db;
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: #fff5f5;
      color: #dc3545;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;

      a {
        color: #4169e1;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Check user role and redirect accordingly
        const userRole = response.user?.role?.toLowerCase();
        if (userRole === 'judge') {
          this.router.navigate(['/judge-dashboard']);
        } else if (userRole === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/results']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Failed to login. Please try again.';
      }
    });
  }
} 