import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import firebaseApp from "~/plugins/firebase.client";

export const useAuthStore = defineStore("auth", () => {
  const auth = getAuth(firebaseApp);
  const errorMessage = ref("");
  const errorMessages: Record<string, string> = {
    "Firebase: Error (auth/email-already-in-use).": "This email already exists",
    "Firebase: Error (auth/invalid-email).":
      "The email address you entered is not valid.",
    "Firebase: Error (auth/too-many-requests).":
      "Too many requests. Try again later.",
    "Firebase: Error (auth/user-not-found).": "User not found",
    "Firebase: Error (auth/wrong-password).": "Incorrect password",
    "Firebase: Error (auth/invalid-credential).": "Wrong email or password",
    "Firebase: Error (auth/weak-password).": "Weak password.",
  };
  const isAuthenticated = ref(false);
  const isAuthInitialized = ref(false);
  const currentUser = ref<User | null>(null);
  const router = useRouter();
  const loader = ref(false);

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      errorMessage.value =
        errorMessages[error.message] || "An unexpected error occurred";
      setTimeout(() => (errorMessage.value = ""), 2500);
    }
  };

  const updateAuthState = (user: User | null) => {
    isAuthenticated.value = !!user;
    currentUser.value = user;
    isAuthInitialized.value = true;
    console.log("isAuthenticated", isAuthenticated.value);
    console.log("isAuthINit", isAuthInitialized.value);
  };

  const signUp = async (email: string, password: string, username: string) => {
    loader.value = true;

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateAuthState(userCredentials.user);
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
      updateAuthState(userCredentials.user);
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
      updateAuthState(null);
      await router.push("/signin");
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const waitForAuthState = (): Promise<void> => {
    return new Promise((resolve) => {
      // возращает промис, который не завершится пока не будет вызван resolve
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // регистрируем слушатель онАуфСтейтЧенджд из Файербейз. Он выполняется один раз при запуске(проверка текущего состояния аутентиф.), а так же запускатеся каждый раз когда состояние пользователя меняется
        updateAuthState(user); // обновляем состояние пользователя
        unsubscribe(); // отписываемся от слушателя
        resolve(); // завершаем
      });
    });
  };

  return {
    errorMessage,
    loader,
    handleError,
    signUp,
    signIn,
    signOut,
    isAuthenticated,
    currentUser,
    isAuthInitialized,
    waitForAuthState,
  };
});
