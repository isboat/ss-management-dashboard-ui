import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from './localstorage.service';

describe('AuthService', () => {
  let service: AuthService;
  let storage: jasmine.SpyObj<LocalStorageService>;
  let router: jasmine.SpyObj<Router>;

  const token = (claims: object): string => {
    const payload = btoa(JSON.stringify(claims))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `header.${payload}.signature`;
  };

  beforeEach(() => {
    storage = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', ['get', 'remove']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    service = new AuthService(storage, router);
  });

  it('rejects expired and malformed tokens', () => {
    storage.get.and.returnValue(token({ exp: Math.floor(Date.now() / 1000) - 60 }));
    expect(service.isAuthenticated()).toBeFalse();

    storage.get.and.returnValue('not-a-jwt');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('reads claims from a valid base64url token', () => {
    storage.get.and.returnValue(token({
      exp: Math.floor(Date.now() / 1000) + 60,
      email: 'admin@example.com',
      role: ['User', 'Admin']
    }));

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.isAdminUser()).toBeTrue();
    expect(service.authUserEmail()).toBe('admin@example.com');
  });

  it('clears the session when forcing a login redirect', () => {
    service.redirectToLogin(true);

    expect(storage.remove).toHaveBeenCalledWith('token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
