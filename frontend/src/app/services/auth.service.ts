import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
        JSON.parse(localStorage.getItem('currentUser') || 'null')
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        // Store user details and jwt token in local storage to keep user logged in between page refreshes
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  register(fullName: string, email: string, password: string, role: string = 'participant') {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
      fullName,
      email,
      password,
      role
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isJudge(): boolean {
    const user = this.currentUserValue;
    return user?.user?.role === 'participant';  // In the database, 'participant' role means they are a judge
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.user?.role === 'admin';
  }

  isParticipant(): boolean {
    const user = this.currentUserValue;
    return user?.user?.role === 'user';  // In the database, 'user' role means they are a participant
  }

  getUserRole(): string | null {
    return this.currentUserValue?.user?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue?.token;
  }

  getRedirectUrl(): string {
    const role = this.getUserRole();
    switch (role) {
      case 'judge':
        return '/judge-dashboard';
      case 'admin':
        return '/admin';
      case 'participant':
        return '/results';
      default:
        return '/home';
    }
  }
} 