import { API_URL } from "./api";
import { apiFetch } from "./api.client";

// ==========================================
// 🤖 SPRINT 1 — AI COACHING CHAT SERVICES
// ==========================================

export async function getChatSessions() {
  const response = await apiFetch(`${API_URL}/ai/chat/sessions`);
  if (!response.ok) throw new Error("Failed to fetch chat sessions");
  return await response.json();
}

export async function createChatSession(title: string) {
  const response = await apiFetch(`${API_URL}/ai/chat/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error("Failed to create chat session");
  return await response.json();
}

export async function getChatMessages(sessionId: number) {
  const response = await apiFetch(`${API_URL}/ai/chat/sessions/${sessionId}/messages`);
  if (!response.ok) throw new Error("Failed to fetch chat messages");
  return await response.json();
}

export async function sendChatMessage(sessionId: number, message: string) {
  const response = await apiFetch(`${API_URL}/ai/chat/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error("Failed to send chat message");
  return await response.json();
}

// ==========================================
// 📝 SPRINT 2 — RESUME AI OPTIMIZER SERVICES
// ==========================================

export async function improveResumeSection(sectionContent: string, jobDescription?: string) {
  const response = await apiFetch(`${API_URL}/ai/resume/improve-section`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sectionContent, jobDescription }),
  });
  if (!response.ok) throw new Error("Failed to improve resume section");
  return await response.json();
}

export interface ATSAnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export async function analyzeATSScore(resumeContent: string, jobDescription: string): Promise<ATSAnalysisResult> {
  const response = await apiFetch(`${API_URL}/ai/resume/ats-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeContent, jobDescription }),
  });
  if (!response.ok) throw new Error("Failed to analyze ATS score");
  return await response.json();
}

export async function fixResumeGrammar(text: string) {
  const response = await apiFetch(`${API_URL}/ai/resume/grammar-fix`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Failed to fix grammar");
  return await response.json();
}

export async function rewriteResumeBullets(bullets: string[]) {
  const response = await apiFetch(`${API_URL}/ai/resume/rewrite-bullets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bullets }),
  });
  if (!response.ok) throw new Error("Failed to rewrite bullet points");
  return await response.json();
}

export async function suggestMissingSkills(experienceText: string, targetRole: string) {
  const response = await apiFetch(`${API_URL}/ai/resume/suggest-skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ experienceText, targetRole }),
  });
  if (!response.ok) throw new Error("Failed to suggest missing skills");
  return await response.json();
}

export async function generateResumeSummary(experienceAndSkills: string) {
  const response = await apiFetch(`${API_URL}/ai/resume/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ experienceAndSkills }),
  });
  if (!response.ok) throw new Error("Failed to generate resume summary");
  return await response.json();
}
