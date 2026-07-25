import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';

interface TokenClaims {
  email?: string;
  exp?: number;
  role?: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'token';

  constructor(private localStorage: LocalStorageService, private router: Router){}

  getAuthorizationToken(): string | null {
    return this.localStorage.get(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const claims = this.getTokenClaims();
    return claims !== null && (claims.exp === undefined || claims.exp * 1000 > Date.now());
  }

  isAdminUser(): boolean {
    if (!this.isAuthenticated()) return false;

    const role = this.getTokenClaims()?.role;
    return role === 'Admin' || (Array.isArray(role) && role.includes('Admin'));
  }

  authUserEmail(): string | null {
    return this.isAuthenticated() ? this.getTokenClaims()?.email ?? null : null;
  }

  redirectToLogin(clearSession = false): void {
    if (clearSession) this.localStorage.remove(this.tokenKey);
    this.router.navigate(['/login']);
  }

  private getTokenClaims(): TokenClaims | null {
    const token = this.getAuthorizationToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map(character => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );
      return JSON.parse(json) as TokenClaims;
    } catch {
      return null;
    }
  }
}
