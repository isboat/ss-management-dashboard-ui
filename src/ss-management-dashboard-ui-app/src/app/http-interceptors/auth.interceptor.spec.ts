import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/auth.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', [
      'getAuthorizationToken',
      'redirectToLogin'
    ]);
    auth.getAuthorizationToken.and.returnValue('token-value');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('adds a bearer token only to API requests', () => {
    http.get(`${environment.apiBaseUrl}/v1/screens`).subscribe();
    const apiRequest = controller.expectOne(`${environment.apiBaseUrl}/v1/screens`);
    expect(apiRequest.request.headers.get('Authorization')).toBe('Bearer token-value');
    apiRequest.flush({});

    http.get('https://example.com/public').subscribe();
    const externalRequest = controller.expectOne('https://example.com/public');
    expect(externalRequest.request.headers.has('Authorization')).toBeFalse();
    externalRequest.flush({});
  });

  it('clears the session after an API unauthorized response', () => {
    http.get(`${environment.apiBaseUrl}/private`).subscribe({ error: () => undefined });
    controller.expectOne(`${environment.apiBaseUrl}/private`).flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(auth.redirectToLogin).toHaveBeenCalledWith(true);
  });
});
