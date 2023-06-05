import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey: string = "token";

  constructor(private localStorage: LocalStorageService, private router: Router){}

  getAuthorizationToken(): string {
    return this.localStorage.get(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthorizationToken();
  }

  redirectToLogin(force?: boolean) {
    if(force) this.localStorage.remove(this.tokenKey);
    this.router.navigate(['/login']);
}
}
