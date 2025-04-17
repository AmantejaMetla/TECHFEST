import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JudgeDashboardComponent } from './components/judge-dashboard/judge-dashboard.component';

const routes: Routes = [
  { path: '', component: JudgeDashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    JudgeDashboardComponent
  ],
  exports: [RouterModule]
})
export class JudgeModule { } 