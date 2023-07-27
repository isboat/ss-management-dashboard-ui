import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';
import { Buffer } from 'buffer';

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

  isAdminUser(): boolean {
    try {
      const token = this.getAuthorizationToken();
      if(!token) return false;

      var parts = token.split('.')
      if(parts.length != 3) return false;

      const str = Buffer.from(parts[1], 'base64').toString('utf8');
      const parsedClaims = JSON.parse(str);
      return parsedClaims["role"] === "Admin";
      
    } catch (error) {
      console.log(error)
    }
  }

  redirectToLogin(force?: boolean) {
    if(force) this.localStorage.remove(this.tokenKey);
    this.router.navigate(['/login']);
}
}
