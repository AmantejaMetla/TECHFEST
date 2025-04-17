import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bio-container">
      <div class="bio-card">
        <h1>Participant Bio</h1>
        <div class="bio-content" *ngIf="user">
          <div class="bio-field">
            <label>Full Name:</label>
            <p>{{user.username}}</p>
          </div>
          <div class="bio-field">
            <label>Email:</label>
            <p>{{user.email}}</p>
          </div>
          <div class="bio-field">
            <label>Role:</label>
            <p>{{user.role}}</p>
          </div>
          <div class="bio-field">
            <label>Registered Events:</label>
            <p *ngIf="events.length === 0">No events registered yet</p>
            <ul *ngIf="events.length > 0">
              <li *ngFor="let event of events">{{event.name}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bio-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 2rem;
    }

    .bio-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 2rem;
      width: 100%;
      max-width: 600px;

      h1 {
        color: #2c3e50;
        margin-bottom: 2rem;
        text-align: center;
      }
    }

    .bio-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .bio-field {
      label {
        font-weight: 500;
        color: #4169e1;
        margin-bottom: 0.5rem;
        display: block;
      }

      p {
        margin: 0;
        color: #2c3e50;
      }

      ul {
        margin: 0;
        padding-left: 1.5rem;
        color: #2c3e50;
      }
    }
  `]
})
export class BioComponent implements OnInit {
  user: any = null;
  events: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue?.user;
    // TODO: Fetch registered events from backend
    this.events = [];
  }
} 