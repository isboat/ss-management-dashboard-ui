import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'app/services/auth.service';
import { environment } from 'environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.auth.getAuthorizationToken();
    const isApiRequest = req.url === environment.apiBaseUrl
      || req.url.startsWith(`${environment.apiBaseUrl}/`);
    const authReq = authToken && isApiRequest
      ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === HttpStatusCode.Unauthorized && isApiRequest) {
          this.auth.redirectToLogin(true);
        }
        return throwError(() => httpErrorResponse);
      })
    );
  }
}
