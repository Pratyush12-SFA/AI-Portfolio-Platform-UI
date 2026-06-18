import { getToken, setToken } from "./Auth/auth.storage";
import { refreshToken } from "./Auth/auth.service";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken();

  let response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    try {
      const refreshResponse = await refreshToken();

      setToken(refreshResponse.accessToken);

      response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshResponse.accessToken}`,
        },
      });
    } catch {
      localStorage.removeItem("access_token");

      window.location.href = "/login";
    }
  }

  return response;
}
