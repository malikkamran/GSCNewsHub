import { describe, it, expect } from 'vitest';
import { getRedirectPath, isAuthorized } from './auth-utils';
import { User } from '@shared/schema';

describe('Auth Logic', () => {
  const adminUser = { id: 1, username: 'admin', role: 'admin' } as User;
  const partnerUser = { id: 2, username: 'partner', role: 'partner' } as User;
  const regularUser = { id: 3, username: 'user', role: 'user' } as User;

  describe('getRedirectPath', () => {
    it('should redirect admin to /admin/dashboard', () => {
      expect(getRedirectPath(adminUser)).toBe('/admin/dashboard');
    });

    it('should redirect partner to /partner', () => {
      expect(getRedirectPath(partnerUser)).toBe('/partner');
    });

    it('should redirect regular user to /', () => {
      expect(getRedirectPath(regularUser)).toBe('/');
    });

    it('should redirect null user to /', () => {
      expect(getRedirectPath(null)).toBe('/');
    });
  });

  describe('isAuthorized', () => {
    it('should return true if user has required role', () => {
      expect(isAuthorized(partnerUser, 'partner')).toBe(true);
    });

    it('should return false if user does not have required role', () => {
      expect(isAuthorized(adminUser, 'partner')).toBe(false);
    });

    it('should return false if user is null', () => {
      expect(isAuthorized(null, 'partner')).toBe(false);
    });
  });
});
