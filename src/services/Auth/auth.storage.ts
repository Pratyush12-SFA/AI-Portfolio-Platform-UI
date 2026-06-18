const TOKEN_KEY = "access_token";

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
    return localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}
export function setRefreshToken(
  token: string
) {
  localStorage.setItem(
    "refresh_token",
    token
  );
}

export function getRefreshToken() {
  return localStorage.getItem(
    "refresh_token"
  );
}

export function removeRefreshToken() {
  localStorage.removeItem(
    "refresh_token"
  );
}