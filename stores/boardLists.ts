import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "./auth";
import { useListCardsStore, type ICard } from "./listCards";
import { debounce } from "lodash";

export interface IBoardList {
  listId: string;
  listName: string;
  createdAt: Date;
  order: number;
}

export const useBoardListsStore = defineStore("boardLists", () => {
  const loader = ref(false);
  const authStore = useAuthStore();
  const listCardsStore = useListCardsStore();
  const { currentUser } = storeToRefs(authStore);
  const db = getFirestore();
  const boardLists = ref<IBoardList[]>([]);

  const createList = async (
    boardId: string,
    listName: string
  ): Promise<void> => {
    loader.value = true;
    try {
      if (currentUser.value?.uid) {
        await getBoardLists(boardId);
        const maxOrder = boardLists.value.length
          ? Math.max(...boardLists.value.map((list) => list.order))
          : -1;

        const payload: IBoardList = {
          listId: uuidv4(),
          listName,
          createdAt: new Date(),
          order: maxOrder + 1,
        };

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
        orderBy("order", "asc")
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
          { listName, updatedAt: new Date() }
        );
        await getBoardLists(boadrdId);
      }
    } catch (e) {
      console.error("Error updating list name: ", e);
    } finally {
      loader.value = false;
    }
  };

  const updateBoardListOrder = debounce(
    async (boardId: string, reorderedLists: IBoardList[]): Promise<void> => {
      loader.value = true;

      try {
        if (currentUser.value?.uid) {
          const batch = writeBatch(db);
          reorderedLists.forEach((list, index) => {
            const listRef = doc(
              db,
              "users",
              `${currentUser.value?.uid}`,
              "boards",
              `${boardId}`,
              "lists",
              `${list.listId}`
            );
            batch.update(listRef, { order: index });
          });
          await batch.commit();
          await getBoardLists(boardId);
        }
      } catch (e) {
        console.error("Error updating list order: ", e);
      } finally {
        loader.value = false;
      }
    },
    300
  );

  const searchListsAndCards = (boardId: string, query: string) => {
    if (!query.trim()) {
      // Если запрос пустой, возвращаем все списки и пустые фильтры карточек
      return {
        filteredLists: boardLists.value,
        cardFilters: new Map<string, string[]>(),
      };
    }

    const searchTerms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);

    const matchingListIds = new Set<string>();
    const cardFilters = new Map<string, string[]>();

    // Поиск по спискам
    boardLists.value.forEach((list) => {
      if (
        searchTerms.some((term) =>
          list.listName.toLocaleLowerCase().includes(term)
        )
      ) {
        matchingListIds.add(list.listId);
      }
    });

    // Поиск по карточкам
    const cards = Array.from(listCardsStore.allCards.values()).filter(
      (card) => card.boardId === boardId
    );
    cards.forEach((card) => {
      if (
        searchTerms.some((term) => card.name.toLocaleLowerCase().includes(term))
      ) {
        matchingListIds.add(card.listId);
        if (!cardFilters.has(card.listId)) {
          cardFilters.set(card.listId, []);
        }
        cardFilters.get(card.listId)!.push(card.id);
      }
    });

    // Фильтрация списков
    const filteredLists = boardLists.value.filter((list) =>
      matchingListIds.has(list.listId)
    );

    return { filteredLists, cardFilters };
  };

  return {
    loader,
    createList,
    getBoardLists,
    boardLists,
    updateListName,
    updateBoardListOrder,
    searchListsAndCards,
  };
});
