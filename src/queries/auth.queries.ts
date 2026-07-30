import {
  login,
  register,
  logout,
  googleLogin,
  refreshToken,
} from "../services/Auth/auth.service";

import { setToken, removeToken } from "../services/Auth/auth.storage";

export async function loginUser(request: Auth.LoginRequest) {
  const response = await login(request);

  setToken(response.AccessToken);

  return response;
}

export async function registerUser(request: Auth.RegisterRequest) {
  const response = await register(request);

  setToken(response.AccessToken);

  return response;
}

export async function logoutUser() {
  await logout();

  removeToken();
}

export async function googleLoginUser(idToken: string) {
  const response = await googleLogin(idToken);

  setToken(response.AccessToken);
  return response;
}

export async function refreshUserToken() {
  const response = await refreshToken();

  setToken(response.AccessToken);

  return response;
}
