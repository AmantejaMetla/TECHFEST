import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultsService } from '../../../../services/results.service';

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss']
})
export class ResultFormComponent implements OnInit {
  resultForm: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  resultId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private resultsService: ResultsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resultForm = this.formBuilder.group({
      event: ['', Validators.required],
      participant: ['', Validators.required],
      criteria: this.formBuilder.group({
        technical: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
        innovation: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
        presentation: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
        implementation: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
      }),
      feedback: [''],
      round: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.resultId = this.route.snapshot.paramMap.get('id');
    if (this.resultId) {
      this.isEditMode = true;
      this.loadResult(this.resultId);
    }
  }

  loadResult(id: string) {
    this.loading = true;
    this.resultsService.getResultById(id)
      .subscribe({
        next: (result) => {
          this.resultForm.patchValue({
            event: result.event,
            participant: result.participant._id,
            round: result.round
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  onSubmit() {
    if (this.resultForm.invalid) {
      return;
    }

    this.loading = true;
    const resultData = this.resultForm.value;

    const request = this.isEditMode ?
      this.resultsService.updateResult(this.resultId!, { scores: resultData.criteria, feedback: resultData.feedback }) :
      this.resultsService.createResult(resultData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/results']);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  // Convenience getter for form fields
  get f() { return this.resultForm.controls; }
  get c() { return (this.f['criteria'] as FormGroup).controls; }
} 