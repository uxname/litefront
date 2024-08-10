export interface IAuthStore {
  accessToken: string | undefined;
  setAccessToken: (accessToken: string) => void;
  clear: () => void;
}
