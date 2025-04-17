import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ResultsService } from '../../../../services/results.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe]
})
export class ResultsListComponent implements OnInit {
  results: any[] = [];
  loading = false;
  error = '';

  constructor(
    private resultsService: ResultsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.loading = true;
    this.resultsService.getAllResults()
      .subscribe({
        next: (data) => {
          this.results = data;
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

  deleteResult(id: string) {
    if (confirm('Are you sure you want to delete this result?')) {
      this.resultsService.deleteResult(id)
        .subscribe({
          next: () => {
            this.results = this.results.filter(result => result._id !== id);
          },
          error: (error) => {
            this.error = error;
          }
        });
    }
  }
} 