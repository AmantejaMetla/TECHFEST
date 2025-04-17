import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface EventResult {
  eventName: string;
  score: number;
  rank: number;
  totalParticipants: number;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <div class="results-card">
        <h1>Your Results</h1>
        <div class="results-content" *ngIf="results.length > 0; else noResults">
          <div class="result-item" *ngFor="let result of results">
            <h2>{{result.eventName}}</h2>
            <div class="result-details">
              <div class="detail">
                <label>Score</label>
                <p>{{result.score}}</p>
              </div>
              <div class="detail">
                <label>Rank</label>
                <p>#{{result.rank}} of {{result.totalParticipants}}</p>
              </div>
            </div>
            <div class="rank-visual">
              <div class="rank-bar" [style.width.%]="(result.rank / result.totalParticipants) * 100"></div>
            </div>
          </div>
        </div>
        <ng-template #noResults>
          <p class="no-results">You haven't participated in any events yet.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 2rem;
    }

    .results-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 2rem;
      width: 100%;
      max-width: 800px;

      h1 {
        color: #2c3e50;
        margin-bottom: 2rem;
        text-align: center;
      }
    }

    .results-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .result-item {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;

      h2 {
        color: #4169e1;
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
      }
    }

    .result-details {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .detail {
      label {
        display: block;
        font-weight: 500;
        color: #6c757d;
        margin-bottom: 0.25rem;
      }

      p {
        margin: 0;
        color: #2c3e50;
        font-size: 1.25rem;
        font-weight: 500;
      }
    }

    .rank-visual {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .rank-bar {
      height: 100%;
      background: #4169e1;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .no-results {
      text-align: center;
      color: #6c757d;
      font-size: 1.1rem;
      margin: 2rem 0;
    }
  `]
})
export class ResultsComponent implements OnInit {
  results: EventResult[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // TODO: Fetch actual results from backend
    // For now, using mock data
    this.results = [
      {
        eventName: 'Hackathon 2024',
        score: 95,
        rank: 2,
        totalParticipants: 50
      },
      {
        eventName: 'Robotics Workshop',
        score: 88,
        rank: 5,
        totalParticipants: 30
      },
      {
        eventName: 'AI Summit',
        score: 92,
        rank: 3,
        totalParticipants: 40
      }
    ];
  }
} 