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
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "./auth";

export interface IBoard {
  boardId: string;
  boardName: string;
  boardDescription: string | "";
  gradient: string | "";
  createdAt: Date;
  editedAt?: Date;
}

export const useBoardsStore = defineStore("boards", () => {
  const loader = ref(false);
  const router = useRouter();
  const authStore = useAuthStore();
  const { currentUser } = storeToRefs(authStore);
  const db = getFirestore();
  const boards = ref<IBoard[]>([]);
  const sortOption = ref<"createdAt" | "editedAt" | "boardName">(
    (localStorage.getItem("boardSortOption") as any) || "createdAt"
  );
  const sortDirection = ref<"asc" | "desc">("desc");

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
        collection(db, "users", `${currentUser.value?.uid}`, "boards")
      );

      const docsList = await getDocs(getData);

      boards.value = docsList.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          editedAt: data.editedAt ? data.editedAt.toDate() : undefined,
        } as IBoard;
      });
      sortBoards();
    } catch (e) {
      console.error("Error fetching boards:", e);
    } finally {
      loader.value = false;
    }
  };

  const sortBoards = () => {
    boards.value.sort((a, b) => {
      let result = 0;
      switch (sortOption.value) {
        case "createdAt":
          result = b.createdAt.getTime() - a.createdAt.getTime();
          break;

        case "editedAt":
          const aEditedAt = a.editedAt || a.createdAt;
          const bEditedAt = b.editedAt || b.createdAt;
          result = bEditedAt.getTime() - aEditedAt.getTime();
          break;

        case "boardName":
          result = a.boardName.localeCompare(b.boardName, undefined, {
            sensitivity: "base",
          });
          break;
      }
      return sortDirection.value === "desc" ? result : -result;
    });
    boards.value = [...boards.value];
  };

  watch(sortOption, (newValue) => {
    localStorage.setItem("boardSortOption", newValue);
    sortBoards();
  });

  const searchBoards = async (searchTerm: string): Promise<IBoard[]> => {
    if (!currentUser.value?.uid || searchTerm.length < 2) return [];

    try {
      // Разбиваем поисковый запрос на отдельные слова
      const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

      const boardsQuery = query(
        collection(db, "users", currentUser.value.uid, "boards"),
        orderBy("boardName")
      );

      const querySnapshot = await getDocs(boardsQuery);
      return querySnapshot.docs
        .map((doc) => ({ ...(doc.data() as IBoard), boardId: doc.id }))
        .filter((board) => {
          const name = board.boardName.toLowerCase();
          const desc = board.boardDescription?.toLowerCase() || "";
          return searchTerms.some(
            (term) => name.includes(term) || desc.includes(term)
          );
        });
    } catch (e) {
      console.error("Search error:", e);
      return [];
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
      await router.push("/dashboard");
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
    sortOption,
    sortDirection,
    sortBoards,
    searchBoards,
  };
});
