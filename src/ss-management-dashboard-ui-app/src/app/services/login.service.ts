import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';
import { TokenResponse } from 'app/models/token-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private tokenKey = 'token';

  constructor(private http: HttpClient, private localStorage: LocalStorageService, private router: Router) { }

  public logout(): void {
    this.localStorage.remove(this.tokenKey);
    this.router.navigate(['/login']);
  }

  public login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      environment.apiBaseUrl + '/authentication/login',
      {
        username: username,
        password: password,
      },
      { responseType: 'json' }
    );
  }
}
