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
    storage = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', ['get', 'set', 'remove']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  it('rejects expired and malformed tokens', () => {
    storage.get.and.returnValue(token({ exp: Math.floor(Date.now() / 1000) - 60 }));
    service = new AuthService(storage, router);
    expect(service.isAuthenticated()).toBeFalse();

    storage.get.and.returnValue('not-a-jwt');
    service = new AuthService(storage, router);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('reads claims from a valid base64url token', () => {
    storage.get.and.returnValue(token({
      exp: Math.floor(Date.now() / 1000) + 60,
      email: 'admin@example.com',
      role: ['User', 'Admin']
    }));
    service = new AuthService(storage, router);

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.isAdminUser()).toBeTrue();
    expect(service.authUserEmail()).toBe('admin@example.com');
  });

  it('clears the session when forcing a login redirect', () => {
    service = new AuthService(storage, router);
    service.redirectToLogin(true);

    expect(storage.remove).toHaveBeenCalledWith('token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('updates authentication signals when the token changes', () => {
    service = new AuthService(storage, router);
    const adminToken = token({
      exp: Math.floor(Date.now() / 1000) + 60,
      email: 'admin@example.com',
      role: 'Admin'
    });

    service.setAuthorizationToken(adminToken);

    expect(storage.set).toHaveBeenCalledWith('token', adminToken);
    expect(service.authenticated()).toBeTrue();
    expect(service.adminUser()).toBeTrue();
    expect(service.userEmail()).toBe('admin@example.com');

    service.clearAuthorizationToken();
    expect(service.authenticated()).toBeFalse();
  });

  it('invalidates authentication when the token expires', () => {
    jasmine.clock().install();
    try {
      const now = new Date('2026-01-01T00:00:00Z');
      jasmine.clock().mockDate(now);
      storage.get.and.returnValue(token({ exp: Math.floor(now.getTime() / 1000) + 1 }));
      service = new AuthService(storage, router);

      expect(service.authenticated()).toBeTrue();
      jasmine.clock().tick(1_001);
      expect(service.authenticated()).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
