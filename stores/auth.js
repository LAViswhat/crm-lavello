import { def } from "@vue/shared";
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

  const signUp = async (payload) => {
    error.value = "";
    loader.value = true;
    try {
      let response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          ...payload,
          returnSecureToken: true,
        }
      );
      userInfo.value = {
        token: response.data.idToken,
        email: response.data.email,
        userId: response.data.localId,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      };
      loader.value = false;
    } catch (err) {
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
        default:
          error.value = "Some error";
          break;
      }
      loader.value = false;
    }
  };
  return { signUp, userInfo, error, loader };
});
