import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  await authStore.initAuth();
  if (!authStore.isAuthenticated) {
    await authStore.initAuth();
    return navigateTo("/");
  }
});
