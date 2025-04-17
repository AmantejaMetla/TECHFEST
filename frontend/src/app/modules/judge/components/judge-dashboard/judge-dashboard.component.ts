import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ResultsService } from '../../../../services/results.service';
import { environment } from '../../../../../environments/environment';

interface JudgeStats {
  pending: number;
  completed: number;
  total: number;
}

interface Submission {
  _id: string;
  event: string;
  participant: {
    username: string;
  };
  status: string;
  submittedAt: Date;
}

@Component({
  selector: 'app-judge-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Judge Dashboard</h1>
        <div class="user-actions">
          <button 
            *ngIf="isJudgeOrAdmin" 
            class="btn-swagger" 
            (click)="openSwagger()">
            Open Admin Panel
          </button>
          <div class="user-info">
            <span>Welcome, {{ judgeName }}</span>
          </div>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Pending Evaluations</h3>
            <p class="stat-number">{{ pendingEvaluations }}</p>
          </div>
          <div class="stat-card">
            <h3>Completed Evaluations</h3>
            <p class="stat-number">{{ completedEvaluations }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Events</h3>
            <p class="stat-number">{{ totalEvents }}</p>
          </div>
        </div>

        <section class="recent-submissions">
          <h2>Recent Submissions</h2>
          <div class="loading-spinner" *ngIf="loading">
            <div class="spinner"></div>
          </div>
          
          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <div class="submissions-grid" *ngIf="!loading && !error">
            <div class="submission-card" *ngFor="let submission of recentSubmissions">
              <div class="submission-header">
                <h3>{{ submission.event }}</h3>
                <span class="status-badge" [class]="submission.status">
                  {{ submission.status }}
                </span>
              </div>
              <div class="submission-details">
                <p><strong>Participant:</strong> {{ submission.participant.username }}</p>
                <p><strong>Submitted:</strong> {{ submission.submittedAt | date:'medium' }}</p>
              </div>
              <div class="submission-actions">
                <button class="btn-primary" [routerLink]="['/judge-dashboard/evaluate', submission._id]">
                  {{ submission.status === 'pending' ? 'Evaluate' : 'View Details' }}
                </button>
              </div>
            </div>
          </div>

          <div class="no-submissions" *ngIf="!loading && !error && recentSubmissions.length === 0">
            <p>No submissions to evaluate at this time.</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eee;

      h1 {
        color: #2c3e50;
        margin: 0;
      }

      .user-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-info {
        color: #666;
        font-size: 1.1rem;
      }
    }

    .btn-swagger {
      background: #85EA2D;
      color: #1c1c1c;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        background: #78d327;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;

      h3 {
        color: #666;
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
      }

      .stat-number {
        color: #2c3e50;
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
      }
    }

    .recent-submissions {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h2 {
        color: #2c3e50;
        margin: 0 0 1.5rem 0;
      }
    }

    .submissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .submission-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #eee;

      .submission-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.875rem;
        font-weight: 500;

        &.pending {
          background: #fff3cd;
          color: #856404;
        }

        &.evaluated {
          background: #d4edda;
          color: #155724;
        }
      }

      .submission-details {
        margin-bottom: 1rem;

        p {
          margin: 0.5rem 0;
          color: #666;
        }
      }
    }

    .btn-primary {
      background: #4169e1;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s;

      &:hover {
        background: #2851db;
      }
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 2rem;

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }

    .error-message {
      background: #fff5f5;
      color: #dc3545;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .no-submissions {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class JudgeDashboardComponent implements OnInit {
  judgeName: string = '';
  pendingEvaluations: number = 0;
  completedEvaluations: number = 0;
  totalEvents: number = 0;
  recentSubmissions: Submission[] = [];
  loading: boolean = false;
  error: string | null = null;
  isJudgeOrAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private resultsService: ResultsService
  ) {}

  ngOnInit() {
    this.loadJudgeInfo();
    this.loadDashboardData();
  }

  openSwagger() {
    const token = this.authService.currentUserValue?.token;
    if (token) {
      // Store token in localStorage for Swagger UI to use
      localStorage.setItem('swagger_token', token);
      // Open Swagger UI in a new tab
      window.open('http://localhost:5000/api-docs', '_blank');
    } else {
      console.error('No authentication token found');
    }
  }

  private loadJudgeInfo() {
    const user = this.authService.currentUserValue?.user;
    if (user) {
      this.judgeName = user.username;
      this.isJudgeOrAdmin = this.authService.isJudge() || this.authService.isAdmin();
    }
  }

  private loadDashboardData() {
    this.loading = true;
    this.error = null;

    this.resultsService.getJudgeStats().subscribe({
      next: (stats: JudgeStats) => {
        this.pendingEvaluations = stats.pending;
        this.completedEvaluations = stats.completed;
        this.totalEvents = stats.total;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
      }
    });

    this.resultsService.getRecentSubmissions().subscribe({
      next: (submissions: Submission[]) => {
        this.recentSubmissions = submissions;
      },
      error: (error: Error) => {
        this.error = 'Failed to load recent submissions';
      }
    });
  }
} 