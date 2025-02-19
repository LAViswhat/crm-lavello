import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "./auth";

export interface IBoard {
  boardId: string;
  boardName: string;
  boardDescription: string | "";
  gradient: string | "";
  createdAt: Date;
}

export const useBoardsStore = defineStore("boards", () => {
  const loader = ref(false);
  const router = useRouter();
  const authStore = useAuthStore();
  const { currentUser } = storeToRefs(authStore);
  const db = getFirestore();
  const boards = ref<IBoard[]>([]);

  const createBoard = async (
    name: string,
    desc: string | undefined,
    gradient: string | undefined
  ): Promise<void> => {
    loader.value = true;
    const payload: IBoard = {
      boardId: uuidv4(),
      boardName: name,
      boardDescription: desc ?? "",
      gradient: gradient ?? "",
      createdAt: new Date(),
    };
    try {
      if (currentUser.value?.uid) {
        await setDoc(
          doc(
            db,
            "users",
            `${currentUser.value?.uid}`,
            "boards",
            `${payload.boardId}`
          ),
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
    if (!currentUser.value?.uid) return;
    loader.value = true;
    try {
      const getData = query(
        collection(db, "users", `${currentUser.value?.uid}`, "boards"),
        orderBy("createdAt", "desc")
      );

      const docsList = await getDocs(getData);

      boards.value = docsList.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
        } as IBoard;
      });
    } catch (e) {
      console.error("Error fetching boards:", e);
    } finally {
      loader.value = false;
    }
  };

  const getBoard = async (boardId: string): Promise<IBoard | null> => {
    if (!currentUser.value?.uid) return null;

    const docRef = doc(
      db,
      "users",
      `${currentUser.value?.uid}`,
      "boards",
      boardId
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as IBoard;
    } else {
      return null;
    }
  };

  const updateBoard = async (
    boardId: string,
    name: string,
    description: string | undefined,
    gradient: string | undefined
  ): Promise<void> => {
    try {
      if (currentUser.value?.uid) {
        await updateDoc(
          doc(db, "users", `${currentUser.value?.uid}`, "boards", boardId),
          {
            boardName: name,
            boardDescription: description ?? "",
            gradient: gradient ?? "",
            editedAt: new Date(),
          }
        );

        await getBoards();
      }
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const removeBoard = async (boardId: string): Promise<void> => {
    if (!currentUser.value?.uid) return;

    try {
      await deleteDoc(
        doc(db, "users", `${currentUser.value?.uid}`, "boards", boardId)
      );
      await getBoards();
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  return {
    loader,
    createBoard,
    getBoards,
    getBoard,
    boards,
    updateBoard,
    removeBoard,
  };
});
