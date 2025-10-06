
// Define role types for the admin section
export type AppRole = 'admin' | 'user' | 'host';

export type UserRole = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
};

export type SupabaseUser = {
  id: string;
  email?: string;
};

export type UserWithRoles = {
  id: string;
  email: string;
  roles: AppRole[];
};
