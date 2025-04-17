import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header>
      <nav class="navbar">
        <div class="nav-brand">
          <a routerLink="/">TECHFEST</a>
        </div>
        
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
          <ng-container *ngIf="isLoggedIn()">
            <!-- Show Bio for all users -->
            <a routerLink="/bio" routerLinkActive="active">Bio</a>
            
            <!-- Show Profile and Results only for participants (users with 'user' role) -->
            <ng-container *ngIf="isParticipant()">
              <a routerLink="/profile" routerLinkActive="active">Profile</a>
              <a routerLink="/results" routerLinkActive="active">Results</a>
            </ng-container>

            <!-- Show Judge Dashboard for judges (users with 'participant' role in DB) -->
            <ng-container *ngIf="isJudge()">
              <a routerLink="/judge-dashboard" routerLinkActive="active">Judge Dashboard</a>
            </ng-container>

            <!-- Show Admin Dashboard for admins -->
            <ng-container *ngIf="isAdmin()">
              <a routerLink="/admin" routerLinkActive="active">Admin Dashboard</a>
            </ng-container>
          </ng-container>
        </div>
        
        <div class="nav-auth">
          <ng-container *ngIf="!isLoggedIn(); else loggedInTpl">
            <a routerLink="/login" class="btn-login">Login</a>
            <a routerLink="/register" class="btn-register">Register</a>
          </ng-container>
          <ng-template #loggedInTpl>
            <span class="welcome-text">Welcome, {{getUserName()}}</span>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </ng-template>
          <button class="menu-toggle" (click)="toggleMenu()">
            <span class="hamburger"></span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Mobile menu -->
    <div class="mobile-menu" [class.active]="isMenuOpen">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
      <a routerLink="/contact" routerLinkActive="active">Contact</a>
      <ng-container *ngIf="isLoggedIn()">
        <!-- Show Bio for all users -->
        <a routerLink="/bio" routerLinkActive="active">Bio</a>
        
        <!-- Show Profile and Results only for participants -->
        <ng-container *ngIf="isParticipant()">
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <a routerLink="/results" routerLinkActive="active">Results</a>
        </ng-container>

        <!-- Show Judge Dashboard for judges -->
        <ng-container *ngIf="isJudge()">
          <a routerLink="/judge-dashboard" routerLinkActive="active">Judge Dashboard</a>
        </ng-container>

        <!-- Show Admin Dashboard for admins -->
        <ng-container *ngIf="isAdmin()">
          <a routerLink="/admin" routerLinkActive="active">Admin Dashboard</a>
        </ng-container>

        <a (click)="logout(); toggleMenu()" class="logout-link">Logout</a>
      </ng-container>
      <ng-container *ngIf="!isLoggedIn()">
        <a routerLink="/login">Login</a>
        <a routerLink="/register">Register</a>
      </ng-container>
    </div>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #4169e1;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      
      a {
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover {
          color: #4169e1;
        }

        &.active {
          color: #4169e1;
        }
      }
    }

    .nav-auth {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-login, .btn-register, .btn-logout {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-login {
      color: #4169e1;
      border: 1px solid #4169e1;
      background: transparent;

      &:hover {
        background: #4169e1;
        color: white;
      }
    }

    .btn-register {
      background: #4169e1;
      color: white;
      border: 1px solid #4169e1;

      &:hover {
        background: #2851db;
        border-color: #2851db;
      }
    }

    .btn-logout {
      background: #dc3545;
      color: white;
      border: none;
      cursor: pointer;

      &:hover {
        background: #c82333;
      }
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .hamburger {
      display: block;
      width: 24px;
      height: 2px;
      background: #2c3e50;
      position: relative;
      transition: all 0.3s;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 24px;
        height: 2px;
        background: #2c3e50;
        transition: all 0.3s;
      }

      &::before {
        top: -6px;
      }

      &::after {
        bottom: -6px;
      }
    }

    .mobile-menu {
      display: none;
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transform: translateY(-100%);
      transition: transform 0.3s;

      &.active {
        transform: translateY(0);
      }

      a {
        display: block;
        padding: 0.75rem 1rem;
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover {
          color: #4169e1;
        }

        &.active {
          color: #4169e1;
        }

        &.logout-link {
          color: #dc3545;
          cursor: pointer;

          &:hover {
            color: #c82333;
          }
        }
      }
    }

    .welcome-text {
      color: #2c3e50;
      font-weight: 500;
      margin-right: 1rem;
    }

    @media (max-width: 768px) {
      .nav-links,
      .btn-login,
      .btn-register,
      .btn-logout {
        display: none;
      }
      
      .menu-toggle {
        display: block;
      }

      .mobile-menu {
        display: block;
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isJudge(): boolean {
    return this.authService.isJudge();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isParticipant(): boolean {
    return this.authService.isParticipant();
  }

  logout() {
    this.authService.logout();
  }

  getUserName(): string {
    const user = this.authService.currentUserValue?.user;
    return user ? user.username : '';
  }
} 