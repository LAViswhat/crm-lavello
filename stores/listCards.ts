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
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "./auth";
import { defineStore, storeToRefs } from "pinia";

export interface ICard {
  id: string;
  name: string;
  listId: string;
  boardId: string;
  info?: any[];
  order: number;
  createdAt: Date;
}

export const useListCardsStore = defineStore("listCards", () => {
  const loader = ref(false);
  const authStore = useAuthStore();
  const { currentUser } = storeToRefs(authStore);
  const db = getFirestore();

  // Храним все карточки в одном Map по ID
  const allCards = ref<Map<string, ICard>>(new Map());

  // Получаем карточки для конкретного списка
  const getCardsForList = (listId: string) => {
    return computed(() =>
      Array.from(allCards.value.values())
        .filter((card) => card.listId === listId)
        .sort((a, b) => a.order - b.order)
    );
  };

  // Создание новой карточки
  const createCard = async (
    boardId: string,
    listId: string,
    cardName: string
  ): Promise<void> => {
    loader.value = true;
    try {
      if (!currentUser.value?.uid) return;

      const cardsInList = Array.from(allCards.value.values()).filter(
        (card) => card.listId === listId
      );

      const newOrder =
        cardsInList.length > 0
          ? Math.max(...cardsInList.map((c) => c.order)) + 1
          : 0;

      const newCard: ICard = {
        id: uuidv4(),
        name: cardName,
        listId,
        boardId,
        order: newOrder,
        createdAt: new Date(),
      };

      // Сохраняем в Firestore
      await setDoc(
        doc(
          db,
          `users/${currentUser.value.uid}/boards/${boardId}/cards/${newCard.id}`
        ),
        newCard
      );

      // Обновляем локальное состояние
      allCards.value.set(newCard.id, newCard);
    } catch (e) {
      console.error("Error creating card:", e);
      throw e;
    } finally {
      loader.value = false;
    }
  };

  // Загрузка всех карточек для доски
  const loadCardsForBoard = async (boardId: string): Promise<void> => {
    if (!currentUser.value?.uid) return;
    loader.value = true;
    try {
      const q = query(
        collection(
          db,
          `users/${currentUser.value.uid}/boards/${boardId}/cards`
        ),
        orderBy("order", "asc")
      );

      const querySnapshot = await getDocs(q);
      const newCardsMap = new Map<string, ICard>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newCardsMap.set(doc.id, {
          id: doc.id,
          name: data.name,
          listId: data.listId,
          boardId: data.boardId,
          order: data.order,
          createdAt: data.createdAt.toDate(),
          info: data.info || [],
        });
      });

      allCards.value = newCardsMap;
    } catch (e) {
      console.error("Error loading cards:", e);
      throw e;
    } finally {
      loader.value = false;
    }
  };

  // Обновление порядка карточек
  const updateCardOrder = async (
    boardId: string,
    listId: string,
    orderedCards: ICard[]
  ): Promise<void> => {
    try {
      if (!currentUser.value?.uid) return;

      const batch = writeBatch(db);
      orderedCards.forEach((card, index) => {
        const cardRef = doc(
          db,
          `users/${currentUser.value!.uid}/boards/${boardId}/cards/${card.id}`
        );
        batch.update(cardRef, {
          order: index,
          listId, // Обновляем listId на случай, если он изменился
        });

        // Обновляем локальное состояние
        allCards.value.set(card.id, {
          ...card,
          order: index,
          listId,
        });
      });

      await batch.commit();
    } catch (e) {
      console.error("Error updating card order:", e);
      // Восстанавливаем состояние
      await loadCardsForBoard(boardId);
      throw e;
    }
  };

  // Перемещение карточки между списками
  const moveCardToList = async (
    boardId: string,
    cardId: string,
    targetListId: string,
    targetIndex: number
  ): Promise<void> => {
    loader.value = true;
    try {
      if (!currentUser.value?.uid) return;

      const card = allCards.value.get(cardId);
      if (!card) throw new Error("Card not found");

      const sourceListId = card.listId;

      // Получаем текущие карточки в целевом списке
      const targetCards = Array.from(allCards.value.values())
        .filter((c) => c.listId === targetListId && c.id !== cardId)
        .sort((a, b) => a.order - b.order);

      // Вставляем карточку на новую позицию
      targetCards.splice(targetIndex, 0, {
        ...card,
        listId: targetListId,
        order: targetIndex,
      });

      // Обновляем порядок всех карточек в целевом списке
      const updatedTargetCards = targetCards.map((c, index) => ({
        ...c,
        order: index,
      }));

      // Обновляем карточки в Firestore
      const batch = writeBatch(db);

      // Обновляем перемещаемую карточку
      const cardRef = doc(
        db,
        `users/${currentUser.value.uid}/boards/${boardId}/cards/${cardId}`
      );
      batch.update(cardRef, {
        listId: targetListId,
        order: targetIndex,
      });

      // Обновляем порядок всех карточек в целевом списке
      updatedTargetCards.forEach((c) => {
        const ref = doc(
          db,
          `users/${currentUser.value!.uid}/boards/${boardId}/cards/${c.id}`
        );
        batch.update(ref, { order: c.order });
      });

      await batch.commit();

      // Обновляем локальное состояние
      updatedTargetCards.forEach((c) => {
        allCards.value.set(c.id, c);
      });

      // Удаляем карточку из исходного списка в локальном состоянии
      if (sourceListId !== targetListId) {
        allCards.value.set(cardId, {
          ...card,
          listId: targetListId,
          order: targetIndex,
        });
      }
    } catch (e) {
      console.error("Error moving card:", e);
      await loadCardsForBoard(boardId);
      throw e;
    } finally {
      loader.value = false;
    }
  };

  // Удаление карточки
  const deleteCard = async (boardId: string, cardId: string): Promise<void> => {
    try {
      if (!currentUser.value?.uid) return;

      await deleteDoc(
        doc(
          db,
          `users/${currentUser.value.uid}/boards/${boardId}/cards/${cardId}`
        )
      );

      allCards.value.delete(cardId);
    } catch (e) {
      console.error("Error deleting card:", e);
      throw e;
    }
  };

  return {
    allCards,
    getCardsForList,
    createCard,
    loadCardsForBoard,
    updateCardOrder,
    moveCardToList,
    deleteCard,
    loader,
  };
});
