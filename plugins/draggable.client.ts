import { defineNuxtPlugin } from "#app";
import { VueDraggableNext } from "vue-draggable-next";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.vueApp.component("draggable", VueDraggableNext);
  }
});
