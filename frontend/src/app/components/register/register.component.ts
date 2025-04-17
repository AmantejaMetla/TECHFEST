import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>Register</h1>
        <p *ngIf="error" class="error-message">{{ error }}</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              formControlName="name" 
              class="form-control"
              [class.is-invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
            <div class="invalid-feedback" *ngIf="registerForm.get('name')?.errors?.['required'] && registerForm.get('name')?.touched">
              Name is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              class="form-control"
              [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched">
              Email is required
            </div>
            <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched">
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
              [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            <div class="invalid-feedback" *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched">
              Password is required
            </div>
            <div class="invalid-feedback" *ngIf="registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched">
              Password must be at least 6 characters
            </div>
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select 
              id="role" 
              formControlName="role" 
              class="form-control"
              [class.is-invalid]="registerForm.get('role')?.invalid && registerForm.get('role')?.touched">
              <option value="participant">Participant</option>
              <option value="judge">Judge</option>
            </select>
            <div class="invalid-feedback" *ngIf="registerForm.get('role')?.errors?.['required'] && registerForm.get('role')?.touched">
              Please select a role
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>

          <p class="login-link">
            Already have an account? <a routerLink="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
      background: #f8f9fa;
    }

    .register-card {
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

      select.form-control {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
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

    .login-link {
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['participant', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = null;

      const { name, email, password, role } = this.registerForm.value;
      this.authService.register(name, email, password, role).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.details || err.error?.message || 'An error occurred during registration';
          this.isLoading = false;
        }
      });
    }
  }
} 