import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { firebaseApp } from "~/plugins/firebase.client";
import { useNuxtApp } from "#app";

interface DecodedToken {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const auth = getAuth(firebaseApp);
  const isAuthenticated = ref(false);
  const currentUser = ref<DecodedToken | null>(null);
  const router = useRouter();
  const errorMessage = ref("");
  const loader = ref(false);

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      switch (error.message) {
        case "Firebase: Error (auth/email-already-in-use).":
          errorMessage.value = "This email already exists";
          break;
        case "Firebase: Error (auth/invalid-email).":
          errorMessage.value =
            "The email address you entered is not valid. Please check the format and try again.";
          break;
        case "Firebase: Error (auth/too-many-requests).":
          errorMessage.value = "Too many requests. Try again later.";
          break;
        case "Firebase: Error (auth/user-not-found).":
          errorMessage.value = "User not found";
          break;
        case "Firebase: Error (auth/wrong-password).":
          errorMessage.value = "Incorrect password";
          break;
        case "Firebase: Error (auth/invalid-credential).":
          errorMessage.value = "Wrong email or password";
          break;
        case "Firebase: Error (auth/weak-password).":
          errorMessage.value = "Weak password.";
          break;
        default:
          errorMessage.value = "An unexpected error occurred";
      }
      setTimeout(() => (errorMessage.value = ""), 2500);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    loader.value = true;

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = userCredentials.user;

      if (currentUser) {
        await updateProfile(currentUser, { displayName: username });
      }
      await router.push("/dashboard");
      return currentUser;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      loader.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    loader.value = true;

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Redirecting to dashboard");
      await router.push("/dashboard");
      return userCredentials.user;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      loader.value = false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await router.push("/signin");
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // Инициализация авторизации на сервере или клиенте
  const initAuth = async () => {
    const { $adminAuth } = useNuxtApp(); // Получаем Admin SDK из плагина
    const token = useCookie("auth").value;

    if (!token) {
      isAuthenticated.value = false;
      currentUser.value = null;
      return;
    }

    try {
      // Проверяем токен с помощью Firebase Admin SDK
      const decodeToken = await $adminAuth.verifyIdToken(token);
      isAuthenticated.value = true;
      currentUser.value = decodeToken; // decodedToken содержит информацию о пользователе
    } catch (error) {
      console.error("Token verification failed:", error);
      isAuthenticated.value = false;
      currentUser.value = null;
    }
  };

  return {
    isAuthenticated,
    currentUser,
    errorMessage,
    loader,
    handleError,
    signUp,
    signIn,
    signOut,
    initAuth,
  };
});
