import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (!authStore.isAuthInitialized) {
    return; // Блокируем переход
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/");
  }
});
