import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { LoginService } from 'app/services/login.service';
import { TokenResponse } from 'app/models/token-response.model';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let loginService: jasmine.SpyObj<LoginService>;
  let loginRequest: Subject<TokenResponse>;

  beforeEach(() => {
    loginRequest = new Subject<TokenResponse>();
    loginService = jasmine.createSpyObj<LoginService>('LoginService', ['login']);
    loginService.login.and.returnValue(loginRequest);
    component = new LoginComponent(
      loginService,
      jasmine.createSpyObj<AuthService>('AuthService', ['setAuthorizationToken']),
      jasmine.createSpyObj<NotificationsService>('NotificationsService', ['showWarning', 'showError']),
      jasmine.createSpyObj<Router>('Router', ['navigate'])
    );
  });

  it('marks the login as pending and ignores repeated submissions', () => {
    component.submit();
    component.submit();

    expect(component.isSigningIn).toBeTrue();
    expect(loginService.login).toHaveBeenCalledTimes(1);
  });

  it('allows another submission after the login request fails', () => {
    component.submit();
    loginRequest.error({ status: 401 });

    expect(component.isSigningIn).toBeFalse();
  });
});
