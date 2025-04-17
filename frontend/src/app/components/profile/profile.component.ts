import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h1>Profile</h1>
        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">{{ success }}</div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              formControlName="name" 
              class="form-control"
              [class.is-invalid]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched">
            <div class="invalid-feedback" *ngIf="profileForm.get('name')?.errors?.['required'] && profileForm.get('name')?.touched">
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
              [class.is-invalid]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
            <div class="invalid-feedback" *ngIf="profileForm.get('email')?.errors?.['required'] && profileForm.get('email')?.touched">
              Email is required
            </div>
            <div class="invalid-feedback" *ngIf="profileForm.get('email')?.errors?.['email'] && profileForm.get('email')?.touched">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              type="tel" 
              formControlName="phone" 
              class="form-control"
              [class.is-invalid]="profileForm.get('phone')?.invalid && profileForm.get('phone')?.touched">
          </div>

          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea 
              id="bio" 
              formControlName="bio" 
              class="form-control"
              rows="4"
              [class.is-invalid]="profileForm.get('bio')?.invalid && profileForm.get('bio')?.touched">
            </textarea>
          </div>

          <div class="form-group">
            <label for="avatar">Profile Picture</label>
            <input 
              type="file" 
              id="avatar" 
              (change)="onFileSelected($event)"
              accept="image/*"
              class="form-control">
            <div *ngIf="profileForm.get('avatar')?.value" class="avatar-preview">
              <img [src]="profileForm.get('avatar')?.value" alt="Profile picture preview">
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="profileForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: calc(100vh - 64px);
      padding: 2rem;
      background: #f8f9fa;
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 600px;

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

      textarea.form-control {
        resize: vertical;
        min-height: 100px;
      }

      .invalid-feedback {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    }

    .avatar-preview {
      margin-top: 1rem;
      
      img {
        max-width: 150px;
        max-height: 150px;
        border-radius: 50%;
        object-fit: cover;
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

    .success-message {
      background: #f0fff4;
      color: #2f855a;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      bio: [''],
      avatar: ['']
    });
  }

  ngOnInit() {
    // Load user data
    const user = this.authService.currentUserValue?.user;
    if (user) {
      this.http.get(`${environment.apiUrl}/participants/${user.id}`).subscribe({
        next: (participant: any) => {
          this.profileForm.patchValue({
            name: participant.name,
            email: participant.email,
            phone: participant.phone,
            bio: participant.bio,
            avatar: participant.avatar_url
          });
        },
        error: (err) => {
          this.error = 'Failed to load profile data';
          console.error('Error loading profile:', err);
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.patchValue({
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.error = null;
      this.success = null;

      const user = this.authService.currentUserValue?.user;
      if (!user) {
        this.error = 'User not found';
        this.isLoading = false;
        return;
      }

      this.http.put(`${environment.apiUrl}/participants/${user.id}`, this.profileForm.value).subscribe({
        next: () => {
          this.success = 'Profile updated successfully';
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to update profile';
          this.isLoading = false;
        }
      });
    }
  }
} 