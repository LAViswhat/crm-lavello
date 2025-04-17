import { defineNuxtPlugin } from "#app";
import draggable from "vue-draggable-next";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("draggable", draggable);
});
