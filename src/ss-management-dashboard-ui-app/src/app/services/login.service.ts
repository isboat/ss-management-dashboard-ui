import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenResponse } from 'app/models/token-response.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  public logout(): void {
    this.authService.clearAuthorizationToken();
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

  public register(formData: any): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      environment.apiBaseUrl + '/authentication/register',
      formData,
      { responseType: 'json' }
    );
  }
}
