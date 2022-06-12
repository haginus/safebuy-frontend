export interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
}