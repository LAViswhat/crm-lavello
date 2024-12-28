import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  authStore.initAuth();
});
