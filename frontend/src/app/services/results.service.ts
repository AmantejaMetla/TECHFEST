import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  constructor(private http: HttpClient) { }

  getAllResults(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/results`);
  }

  getResultById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/results/${id}`);
  }

  getResultsByEvent(eventName: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/results/event/${eventName}`);
  }

  createResult(result: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/results`, result);
  }

  updateResult(id: string, result: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/results/${id}`, result);
  }

  deleteResult(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/results/${id}`);
  }

  // New methods for judge dashboard
  getJudgeStats(): Observable<JudgeStats> {
    return this.http.get<JudgeStats>(`${environment.apiUrl}/results/judge/stats`);
  }

  getRecentSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${environment.apiUrl}/results/judge/submissions`);
  }
} 