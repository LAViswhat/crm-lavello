// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: true, // SSR включён
  build: {
    transpile: [],
  },
  vite: {
    optimizeDeps: {
      exclude: ["firebase-admin"], // Исключаем firebase-admin
    },
    ssr: {
      noExternal: ["firebase-admin"], // Используем firebase-admin только на сервере
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/fonts",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@vee-validate/nuxt",
    "@pinia/nuxt",
  ],
  shadcn: {
    prefix: "Ui",
    componentDir: "./components/ui",
  },
});
