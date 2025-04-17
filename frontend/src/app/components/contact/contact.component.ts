import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contact-container">
      <h2>Contact Us</h2>
      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" formControlName="name" class="form-control">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" class="form-control">
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" formControlName="message" class="form-control" rows="5"></textarea>
        </div>
        <button type="submit" [disabled]="!contactForm.valid">Send Message</button>
      </form>
    </div>
  `,
  styles: [`
    @use "sass:color";

    .contact-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      text-align: center;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        color: #2c3e50;
        font-weight: 500;
      }

      .form-control {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #4169e1;
          box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.2);
        }
      }
    }

    button {
      padding: 1rem 2rem;
      background: #4169e1;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: color.adjust(#4169e1, $lightness: -10%);
      }

      &:disabled {
        background: #cccccc;
        cursor: not-allowed;
      }
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      // Add your form submission logic here
    }
  }
} 