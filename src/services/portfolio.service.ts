import { API_URL } from "./api";
import { apiFetch } from "./api.client";

// EXTENDED AUTH SERVICES
export async function forgotPassword(email: string) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await response.json();
}

export async function resetPassword(request: Auth.ResetPasswordRequest) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return await response.json();
}

export async function requestVerificationEmail() {
  const response = await apiFetch(`${API_URL}/auth/verify-email/request`, {
    method: "POST",
  });
  return await response.json();
}

export async function verifyEmail(token: string) {
  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return await response.json();
}

export async function changePassword(request: Auth.ChangePasswordRequest) {
  const response = await apiFetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return await response.json();
}

export async function getActiveSessions() {
  const response = await apiFetch(`${API_URL}/auth/sessions`);
  return await response.json();
}

export async function revokeSession(refreshTokenId: number) {
  const response = await apiFetch(`${API_URL}/auth/sessions/${refreshTokenId}`, {
    method: "DELETE",
  });
  return await response.json();
}

// PROFILE SERVICES
export async function getProfile() {
  const response = await apiFetch(`${API_URL}/profile`);
  return await response.json();
}

export async function upsertProfile(profile: Portfolio.Profile) {
  const response = await apiFetch(`${API_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  return await response.json();
}

// RESUME DATA CRUD
export async function getResumeData(type: string) {
  const response = await apiFetch(`${API_URL}/resume/${type}`);
  return await response.json();
}

export async function upsertResumeData(type: string, data: Record<string, unknown>) {
  const response = await apiFetch(`${API_URL}/resume/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteResumeData(type: string, id: number) {
  const response = await apiFetch(`${API_URL}/resume/${type}/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}

// PUBLIC PORTFOLIO
export async function getPublicPortfolio(slug: string) {
  const response = await fetch(`${API_URL}/portfolio/${slug}`);
  if (!response.ok) throw new Error("Portfolio not found");
  return await response.json();
}

export async function sendContactMessage(messageData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const response = await fetch(`${API_URL}/portfolio/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });
  return await response.json();
}
