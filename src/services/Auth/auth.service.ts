import { API_URL } from "../api";

export async function login(
  request: Auth.LoginRequest,
): Promise<Auth.LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: request.email,
      password: request.password,
      rememberMe: request.rememberMe,
    }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  const data = await response.json();
  return data;
}

export async function register(
  request: Auth.RegisterRequest,
): Promise<Auth.LoginResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: request.fullName,
      email: request.email,
      password: request.password,
    }),
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return await response.json();
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function googleLogin(idToken: string) {
  const response = await fetch(`${API_URL}/auth/google-login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      IdToken: idToken,
    }),
  });
  if (!response.ok) {
    throw new Error("Google Login failed on backend");
  }
  return await response.json();
}

export async function refreshToken() {
  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Refresh Failed");
  }

  return await response.json();
}
