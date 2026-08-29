import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import type { LoginPayload, SignupPayload } from "@/types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authApi.logout,
  });
}
