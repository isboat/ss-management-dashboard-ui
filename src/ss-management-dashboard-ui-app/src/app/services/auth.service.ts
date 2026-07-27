import { computed, Injectable, signal } from '@angular/core';
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
  private readonly authorizationToken = signal<string | null>(null);
  readonly authenticated = computed(() => {
    const claims = this.getTokenClaims(this.authorizationToken());
    return claims !== null && (claims.exp === undefined || claims.exp * 1000 > Date.now());
  });
  readonly adminUser = computed(() => {
    if (!this.authenticated()) return false;

    const role = this.getTokenClaims(this.authorizationToken())?.role;
    return role === 'Admin' || (Array.isArray(role) && role.includes('Admin'));
  });
  readonly userEmail = computed(() =>
    this.authenticated() ? this.getTokenClaims(this.authorizationToken())?.email ?? null : null
  );

  constructor(private localStorage: LocalStorageService, private router: Router){
    this.authorizationToken.set(this.localStorage.get(this.tokenKey));
  }

  getAuthorizationToken(): string | null {
    return this.authorizationToken();
  }

  setAuthorizationToken(token: string): void {
    this.localStorage.set(this.tokenKey, token);
    this.authorizationToken.set(token);
  }

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  isAdminUser(): boolean {
    return this.adminUser();
  }

  authUserEmail(): string | null {
    return this.userEmail();
  }

  redirectToLogin(clearSession = false): void {
    if (clearSession) this.clearAuthorizationToken();
    this.router.navigate(['/login']);
  }

  clearAuthorizationToken(): void {
    this.localStorage.remove(this.tokenKey);
    this.authorizationToken.set(null);
  }

  private getTokenClaims(token: string | null): TokenClaims | null {
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
