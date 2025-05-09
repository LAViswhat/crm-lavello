<script setup lang="ts">
import { useListCardsStore } from "@/stores/listCards";

const props = defineProps<{
  boardId?: string;
  listId?: string;
  cardFilter?: string[];
}>();

const listCardsStore = useListCardsStore();

// Get cards for the list, optionally filtered
const cardsForList = computed(() => {
  let cards = listCardsStore
    .getCardsForList(props.listId || "")
    .value.sort((a, b) => a.order - b.order);
  if (props.cardFilter && props.cardFilter.length > 0) {
    cards = cards.filter((card) => props.cardFilter!.includes(card.id));
  }
  return cards;
});

// Загружаем карточки при монтировании
onMounted(async () => {
  if (props.boardId) {
    if (props.boardId) {
      await listCardsStore.loadCardsForBoard(props.boardId);
    }
  }
});

const onCardDragChange = async (event: any) => {
  const { moved, added } = event;

  try {
    if (moved) {
      // Перемещение внутри списка
      await listCardsStore.updateCardOrder(
        props.boardId || "",
        props.listId || "",
        cardsForList.value
      );
    } else if (added) {
      // Перемещение между списками
      const card = added.element;
      await listCardsStore.moveCardToList(
        props.boardId || "",
        card.id,
        props.listId || "",
        added.newIndex
      );
    }
  } catch (error) {
    console.error("Drag and drop error:", error);
    // Восстанавливаем состояние при ошибке
    await listCardsStore.loadCardsForBoard(props.boardId || "");
  }
};

const handleDraggableError = (error: any) => {
  console.error("Card draggable error:", error);
};

const handleRemoveCard = async (cardId: string) => {
  try {
    if (props.boardId) {
      await listCardsStore.deleteCard(props.boardId, cardId);
    }
  } catch (error) {
    console.error("Error deleting card:", error);
  }
};
</script>
<template>
  <ClientOnly>
    <UiCardContent class="px-4">
      <draggable
        tag="transition-group"
        :component-data="{
          attrs: {
            name: 'draggableCard',
            class: 'draggableCardList space-y-2 min-h-[50px]',
          },
        }"
        item-key="id"
        :list="cardsForList"
        :group="{ name: 'cards', pull: true, put: true }"
        @change="onCardDragChange"
        @error="handleDraggableError"
        :sort="true"
        animation="300"
        ghost-class="ghost"
        drag-class="dragging"
        :touch="true"
        :fallback-on-body="true"
        :force-fallback="true"
        :empty-insert-threshold="100"
      >
        <template #default>
          <div
            v-for="card in cardsForList"
            :key="card.id"
            class="p-2 min-h-16 bg-gray-100 rounded-md relative group"
          >
            <p class="text-sm font-medium">{{ card.name }}</p>
            <Icon
              name="cuida:edit-outline"
              size="16"
              class="absolute top-[6px] right-[6px] cursor-pointer opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity"
            />
            <Icon
              @click="handleRemoveCard(card.id)"
              name="mdi:card-remove-outline"
              size="16"
              class="absolute bottom-[6px] right-[6px] cursor-pointer opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity"
            />
          </div>
        </template>
      </draggable>
      <p v-if="cardsForList.length === 0" class="text-gray-500">No cards yet</p>
    </UiCardContent>
  </ClientOnly>
</template>

<style scoped>
.ghost {
  opacity: 0.6;
  transform: rotate(2deg);
}

.dragging {
  cursor: grabbing;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  z-index: 50;
  position: relative;
}

.draggableCardList > div:hover {
  background-color: #f3f6f4cc;
  transition: background-color 0.2s ease;
}
</style>
