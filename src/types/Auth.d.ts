namespace Auth {
  interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
  }

  interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
  }

  interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    fullName: string;
    email: string;
  }
  type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => Promise<void>;
  };

  interface ResetPasswordRequest {
    token: string;
    newPassword: string;
  }

  interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
  }
}
