import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import firebaseApp from "~/plugins/firebase.client";

export const useAuthStore = defineStore("auth", () => {
  const auth = getAuth(firebaseApp);
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
      await router.push("/");
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
      await router.push("/");
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
      router.push("/signin");
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  return { errorMessage, loader, handleError, signUp, signIn, signOut };
});
