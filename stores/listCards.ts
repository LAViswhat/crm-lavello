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

export interface IListCard {
  cardId: string;
  cardName: string;
  cardInfo: any[];
  createdAt: Date;
  order: number;
}

export const useListCardsStore = defineStore("listCards", () => {
  const loader = ref(false);
  const authStore = useAuthStore();
  const { currentUser } = storeToRefs(authStore);
  const db = getFirestore();
  const listCards = ref<Map<string, IListCard[]>>(new Map());

  const createCard = async (
    boardId: string,
    listId: string,
    cardName: string
  ): Promise<void> => {
    loader.value = true;
    try {
      if (currentUser.value?.uid) {
        await getListCards(boardId, listId);
        const cards = listCards.value.get(listId) || [];
        const maxOrder = cards.length
          ? Math.max(...cards.map((card) => card.order))
          : -1;

        const payload: IListCard = {
          cardId: uuidv4(),
          cardName,
          cardInfo: [],
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
            `${listId}`,
            "cards",
            `${payload.cardId}`
          ),
          payload
        );
        await getListCards(boardId, listId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      loader.value = false;
    }
  };

  const getListCards = async (
    boardId: string,
    listId: string
  ): Promise<void> => {
    if (!currentUser.value?.uid) return;
    loader.value = true;
    try {
      const getData = query(
        collection(
          db,
          "users",
          `${currentUser.value?.uid}`,
          "boards",
          `${boardId}`,
          "lists",
          `${listId}`,
          "cards"
        ),
        orderBy("order", "asc")
      );
      const docsList = await getDocs(getData);
      listCards.value.set(
        listId,
        docsList.docs.map((doc) => {
          const data = doc.data();
          return {
            cardId: data.cardId,
            cardName: data.cardName,
            cardInfo: data.cardInfo,
            order: data.order,
            createdAt: data.createdAt.toDate(),
          } as IListCard;
        })
      );
      listCards.value = new Map(listCards.value);
    } catch (e) {
      console.error("Error fetching cards:", e);
    } finally {
      loader.value = false;
    }
  };

  const updateCardOrder = async (
    boardId: string,
    listId: string,
    reorderedCards: IListCard[]
  ): Promise<void> => {
    try {
      if (currentUser.value?.uid) {
        const batch = writeBatch(db);
        reorderedCards.forEach((card, index) => {
          const cardRef = doc(
            db,
            "users",
            `${currentUser.value?.uid}`,
            "boards",
            `${boardId}`,
            "lists",
            `${listId}`,
            "cards",
            `${card.cardId}`
          );
          batch.update(cardRef, { order: index });
        });
        await batch.commit();
        await getListCards(boardId, listId);
      }
    } catch (e) {
      console.error("Error updating card order:", e);
    }
  };
  return { createCard, getListCards, updateCardOrder, listCards, loader };
});
