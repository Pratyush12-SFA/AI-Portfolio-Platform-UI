import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  upsertProfile,
  getResumeData,
  upsertResumeData,
  deleteResumeData,
  getPublicPortfolio,
  sendContactMessage,
  getActiveSessions,
  revokeSession,
  changePassword,
  requestVerificationEmail,
} from "../services/portfolio.service";

export const portfolioKeys = {
  all: ["portfolio"] as const,
  profile: () => [...portfolioKeys.all, "profile"] as const,
  resume: (type: string) => [...portfolioKeys.all, "resume", type] as const,
  public: (slug: string) => [...portfolioKeys.all, "public", slug] as const,
  sessions: () => [...portfolioKeys.all, "sessions"] as const,
};

// PROFILE HOOKS
export function useProfile() {
  return useQuery({
    queryKey: portfolioKeys.profile(),
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.profile() });
    },
  });
}

// RESUME HOOKS
export function useResumeData(type: string) {
  return useQuery({
    queryKey: portfolioKeys.resume(type),
    queryFn: () => getResumeData(type),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertResumeData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, data }: { type: string; data: any }) =>
      upsertResumeData(type, data),
    onSuccess: (_: any, variables: { type: string; data: any }) => {
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.resume(variables.type),
      });
    },
  });
}

export function useDeleteResumeData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id }: { type: string; id: number }) =>
      deleteResumeData(type, id),
    onSuccess: (_: any, variables: { type: string; id: number }) => {
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.resume(variables.type),
      });
    },
  });
}

// PUBLIC PORTFOLIO HOOKS
export function usePublicPortfolio(slug: string) {
  return useQuery({
    queryKey: portfolioKeys.public(slug),
    queryFn: () => getPublicPortfolio(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSendContactMessage() {
  return useMutation({
    mutationFn: sendContactMessage,
  });
}

// ACCOUNT & SESSIONS HOOKS
export function useActiveSessions() {
  return useQuery({
    queryKey: portfolioKeys.sessions(),
    queryFn: getActiveSessions,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.sessions() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useRequestVerificationEmail() {
  return useMutation({
    mutationFn: requestVerificationEmail,
  });
}
