import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { ResultDetailComponent } from './components/result-detail/result-detail.component';
import { ResultFormComponent } from './components/result-form/result-form.component';

const routes: Routes = [
  { path: '', component: ResultsListComponent },
  { path: 'new', component: ResultFormComponent },
  { path: ':id', component: ResultDetailComponent },
  { path: ':id/edit', component: ResultFormComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ResultsListComponent,
    ResultDetailComponent,
    ResultFormComponent
  ]
})
export class ResultsModule { } 