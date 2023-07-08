import { Account } from '@/generated/graphql';

export const AuthStorageService = {
  getToken(): string | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const token = localStorage.getItem('token');
    return token === '' ? undefined : token || undefined;
  },
  setToken(token: string | undefined): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!token) {
      localStorage.removeItem('token');
      return;
    }

    localStorage.setItem('token', token);
  },
  getAccount(): Account | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const account = localStorage.getItem('account');
    if (!account) {
      return undefined;
    }

    return JSON.parse(account);
  },
  setAccount(account: Partial<Account> | undefined): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!account) {
      localStorage.removeItem('account');
      return;
    }

    localStorage.setItem('account', JSON.stringify(account));
  },
  clear(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('account');
  },
};
