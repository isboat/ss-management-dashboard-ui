import { computed, Injectable, OnDestroy, signal } from '@angular/core';
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
export class AuthService implements OnDestroy {
  private readonly tokenKey = 'token';
  private readonly authorizationToken = signal<string | null>(null);
  private readonly tokenValidityTick = signal(0);
  private tokenExpiryTimer: ReturnType<typeof setTimeout> | undefined;
  readonly authenticated = computed(() => {
    this.tokenValidityTick();
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
    const token = this.localStorage.get(this.tokenKey);
    this.authorizationToken.set(token);
    this.scheduleExpirationCheck(token);
  }

  getAuthorizationToken(): string | null {
    return this.authorizationToken();
  }

  setAuthorizationToken(token: string): void {
    this.localStorage.set(this.tokenKey, token);
    this.authorizationToken.set(token);
    this.scheduleExpirationCheck(token);
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
    this.clearExpirationTimer();
  }

  ngOnDestroy(): void {
    this.clearExpirationTimer();
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

  private scheduleExpirationCheck(token: string | null): void {
    this.clearExpirationTimer();
    const expiresAt = this.getTokenClaims(token)?.exp;
    if (expiresAt === undefined) return;

    const delay = Math.min(2_147_483_647, Math.max(0, expiresAt * 1000 - Date.now()));
    this.tokenExpiryTimer = setTimeout(() => {
      this.tokenValidityTick.update(value => value + 1);
      if (expiresAt * 1000 > Date.now()) this.scheduleExpirationCheck(this.authorizationToken());
    }, delay);
  }

  private clearExpirationTimer(): void {
    if (this.tokenExpiryTimer !== undefined) clearTimeout(this.tokenExpiryTimer);
    this.tokenExpiryTimer = undefined;
  }
}
