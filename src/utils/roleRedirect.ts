import { UserInfo } from '../api/auth';

/**
 * Foydalanuvchi roliga qarab boshlang'ich marshrutni qaytaradi.
 * - PROCURER  → prokuror (asosiy dashboard)  → '/'
 * - CLIENT    → mijoz paneli                 → '/client'
 * - SELLER    → fabrika paneli               → '/factory'
 * - SUPER_ADMIN → asosiy dashboard           → '/'
 */
export const getHomeRoute = (user: UserInfo): string => {
  switch (user.role) {
    case 'CLIENT':
      return '/client';
    case 'SELLER':
      return '/factory';
    case 'PROCURER':
    case 'SUPER_ADMIN':
    default:
      return '/';
  }
};
