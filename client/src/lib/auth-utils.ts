import { User } from "@shared/schema";

export function getRedirectPath(user: User | null): string {
  if (!user) return '/';
  if (user.role === 'admin') return '/admin/dashboard';
  if (user.role === 'partner') return '/partner';
  return '/';
}

export function isAuthorized(user: User | null, requiredRole: string): boolean {
  if (!user) return false;
  return user.role === requiredRole;
}
