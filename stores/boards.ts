import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export interface IBoardDialog {
  boardId: string;
  boardName: string;
  boardDescription: string | "";
  createdAt: Date;
}

export const useBoardsStore = defineStore("boards", () => {
  const loader = ref(false);
  const router = useRouter();
  const userId = getAuth().currentUser?.uid;
  const db = getFirestore();

  const createBoard = async (
    name: string,
    desc: string | undefined
  ): Promise<void> => {
    loader.value = true;
    const payload: IBoardDialog = {
      boardId: uuidv4(),
      boardName: name,
      boardDescription: desc ?? "",
      createdAt: new Date(),
    };
    try {
      if (userId) {
        await setDoc(
          doc(db, "users", `${userId}`, "boards", `${payload.boardId}`),
          payload
        );
      }
      await router.push("/dashboard");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      loader.value = false;
    }
  };

  return { loader, createBoard };
});
