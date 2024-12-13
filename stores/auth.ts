import axios from "axios";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref({
    token: "",
    email: "",
    userId: "",
    refreshToken: "",
    expiresIn: "",
  });

  const error = ref("");
  const loader = ref(false);
  const isAuth = ref(false);

  const auth = async (payload: Object, type: string) => {
    const stringURL = type === "signup" ? "signUp" : "signInWithPassword";

    loader.value = true;
    try {
      let response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:${stringURL}?key=${API_KEY}`,
        {
          ...payload,
          returnSecureToken: true,
        }
      );
      console.log(response.data);
      userInfo.value = {
        token: response.data.idToken,
        email: response.data.email,
        userId: response.data.localId,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      };
    } catch (err: any) {
      switch (err.response.data.error.message) {
        case "EMAIL_EXISTS":
          error.value = "This email already exists";
          break;
        case "OPERATION_NOT_ALLOWED":
          error.value = "This operation is not allowed";
          break;
        case "Too_MANY_ATTEMPTS_TRY_LATER":
          error.value = "Too many attemps. Try again a bit latter";
          break;
        case "EMAIL_NOT_FOUND":
          error.value = "Email not found.";
          break;
        case "INVALID_LOGIN_CREDENTIALS":
          error.value = "Invalid email or password";
          break;
        case "INVALID_PASSWORD":
          error.value = "Invalid password. Try again.";
          break;
        case "USER_DISABLED":
          error.value = "User disabled";
          break;
        default:
          error.value = "Some error";
          break;
      }

      setTimeout(() => (error.value = ""), 2500);
      throw error.value;
    } finally {
      loader.value = false;
    }
  };
  return { auth, userInfo, error, loader, isAuth };
});
