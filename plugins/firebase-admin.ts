// Инициализация Firebase Admin SDK

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    // Проверка чтоб этот плагин загружался только на серверной стороне
    if (!getApps().length) {
      const serviceAccount = JSON.parse(
        import.meta.env.VITE_FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
      );
      console.log(
        import.meta.server ? "Running on server" : "Running on client"
      );
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
  }
  const adminAuth = getAuth();

  return {
    provide: {
      adminAuth,
    },
  };
});
