import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorage: LocalStorageService, private router: Router){}

  getAuthorizationToken(): string {
    return this.localStorage.get("token");
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
}
}
