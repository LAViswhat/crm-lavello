import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async () => {
  if (import.meta.client) {
    const authStore = useAuthStore();
    await authStore.waitForAuthState();
  }
});
