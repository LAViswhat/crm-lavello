import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "./auth";

export interface IBoardList {
  listId: string;
  listName: string;
  createdAt: Date;
  items: any[];
}

export const useBoardListsStore = defineStore("boardLists", () => {
  const loader = ref(false);
  const authStore = useAuthStore();
  const { currentUser } = storeToRefs(authStore);
  const db = getFirestore();
  const boardLists = ref<IBoardList[]>([]);

  const createList = async (
    boardId: string,
    listName: string
  ): Promise<void> => {
    loader.value = true;
    const payload: IBoardList = {
      listId: uuidv4(),
      listName,
      createdAt: new Date(),
      items: [],
    };
    try {
      if (currentUser.value?.uid) {
        await setDoc(
          doc(
            db,
            "users",
            `${currentUser.value?.uid}`,
            "boards",
            `${boardId}`,
            "lists",
            `${payload.listId}`
          ),
          payload
        );
        await getBoardLists(boardId);
      }
    } catch (e) {
      console.error("Error creating list: ", e);
    } finally {
      loader.value = false;
    }
  };
  const getBoardLists = async (boadrId: string): Promise<void> => {
    if (!currentUser.value?.uid) return;
    loader.value = true;

    try {
      const getData = query(
        collection(
          db,
          "users",
          `${currentUser.value?.uid}`,
          "boards",
          `${boadrId}`,
          "lists"
        ),
        orderBy("createdAt", "asc")
      );

      const docsList = await getDocs(getData);
      boardLists.value = docsList.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
        } as IBoardList;
      });
    } catch (e) {
      console.error("Error fetching lists: ", e);
    } finally {
      loader.value = false;
    }
  };

  const updateListName = async (
    boadrdId: string,
    listId: string,
    listName: string
  ): Promise<void> => {
    loader.value = true;
    try {
      if (currentUser.value?.uid) {
        await updateDoc(
          doc(
            db,
            "users",
            `${currentUser.value?.uid}`,
            "boards",
            `${boadrdId}`,
            "lists",
            `${listId}`
          ),
          { listName, updateAt: new Date() }
        );
        await getBoardLists(boadrdId);
      }
    } catch (e) {
      console.error("Error updating list name: ", e);
    } finally {
      loader.value = false;
    }
  };

  return {
    loader,
    createList,
    getBoardLists,
    boardLists,
    updateListName,
  };
});
