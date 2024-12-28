// Добавил типизацию для $adminAuth как экземпляра Auth из firebase-admin/auth

import type { Auth } from "firebase-admin/auth";

declare module "#app" {
  interface NuxtApp {
    $adminAuth: Auth;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $adminAuth: Auth;
  }
}
