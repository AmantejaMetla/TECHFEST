import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JudgesService {
  constructor(private http: HttpClient) { }

  getAllJudges(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/judges`);
  }

  getJudgeById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/judges/${id}`);
  }

  createJudge(judge: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/judges`, judge);
  }

  updateJudge(id: string, judge: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/judges/${id}`, judge);
  }

  deleteJudge(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/judges/${id}`);
  }
} 