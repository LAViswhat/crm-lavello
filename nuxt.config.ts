// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
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
    "nuxt-tiptap-editor",
  ],
  shadcn: {
    prefix: "Ui",
    componentDir: "./components/ui",
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
  },
  tiptap: {
    prefix: "Tiptap", //prefix for Tiptap imports, composables not included
  },
});
