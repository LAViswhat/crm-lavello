import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export interface IBoard {
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
  const boards = ref<IBoard[]>([]);

  const createBoard = async (
    name: string,
    desc: string | undefined
  ): Promise<void> => {
    loader.value = true;
    const payload: IBoard = {
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
        await getBoards();
      }
      await router.push("/dashboard");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      loader.value = false;
    }
  };

  const getBoards = async (): Promise<void> => {
    if (!userId) return;
    loader.value = true;
    try {
      const getData = query(
        collection(db, "users", `${userId}`, "boards"),
        orderBy("createdAt", "desc")
      );

      const docsList = await getDocs(getData);

      boards.value = docsList.docs.map((doc) => doc.data() as IBoard);
    } catch (e) {
      console.error("Error fetching boards:", e);
    } finally {
      loader.value = false;
    }
  };

  return { loader, createBoard, getBoards, boards };
});
