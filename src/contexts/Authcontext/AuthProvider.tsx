import { useState } from "react";
import { getToken, setToken } from "../../services/Auth/auth.storage";
import { AuthContext } from "./queries";
import { logoutUser } from "../../queries/auth.queries";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokenState, setTokenState] = useState<string | null>(getToken());

  function login(token: string) {
    setToken(token);
    setTokenState(token);
  }
  async function logout() {
    logoutUser();
    setTokenState(null);
  }
  return (
    <AuthContext.Provider
      value={{
        token: tokenState,
        isAuthenticated: !!tokenState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
