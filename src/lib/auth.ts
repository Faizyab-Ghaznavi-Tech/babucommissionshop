export const ADMIN_EMAIL = 'admin@babucommissionshop.com';

export function isAdminEmail(email?: string | null): boolean {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}
