import type { User } from '@supabase/supabase-js';

export function isManagerUser(user: Pick<User, 'app_metadata' | 'user_metadata'> | null) {
  const roles = [user?.app_metadata?.role, user?.user_metadata?.role];
  return roles.includes('manager') || roles.includes('admin');
}
