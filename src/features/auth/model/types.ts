export interface AuthUser {
  sub: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  [key: string]: unknown;
}

export interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: () => Promise<void>;
}
