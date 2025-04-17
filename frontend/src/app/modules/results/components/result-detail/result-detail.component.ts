import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResultsService } from '../../../../services/results.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-result-detail',
  templateUrl: './result-detail.component.html',
  styleUrls: ['./result-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, DecimalPipe]
})
export class ResultDetailComponent implements OnInit {
  result: any = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private resultsService: ResultsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadResult(id);
    }
  }

  loadResult(id: string) {
    this.resultsService.getResultById(id)
      .subscribe({
        next: (data) => {
          this.result = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  get isJudge() {
    return this.authService.isJudge();
  }

  calculateAverageScore(criteria: string): number {
    if (!this.result || !this.result.scores || this.result.scores.length === 0) {
      return 0;
    }

    const total = this.result.scores.reduce((sum: number, score: any) => {
      return sum + (score.criteria[criteria] || 0);
    }, 0);

    return total / this.result.scores.length;
  }
} 