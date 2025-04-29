<script setup lang="ts">
import { useListCardsStore, type IListCard } from "@/stores/listCards";

const props = defineProps<{
  boardId?: string;
  listId?: string;
}>();

const listCardsStore = useListCardsStore();
const { listCards } = storeToRefs(listCardsStore);

const cardsForList = computed({
  get: () => listCards.value.get(props.listId ?? "") || [],
  set: (newCards) => {
    if (props.listId) {
      listCards.value.set(props.listId, newCards);
    }
    // Trigger reactivity
    listCards.value = new Map(listCards.value);
  },
});

// Fetch cards on mount
onMounted(() => {
  if (props.boardId && props.listId) {
    listCardsStore.getListCards(props.boardId, props.listId);
  }
});

// Handle card drag-and-drop
const onCardDragEnd = async () => {
  if (props.boardId && props.listId) {
    await listCardsStore.updateCardOrder(
      props.boardId,
      props.listId,
      cardsForList.value
    );
  }
};

const handleDraggableError = (error: any) => {
  console.error("Card draggable error:", error);
};
</script>
<template>
  <ClientOnly>
    <UiCardContent>
      <draggable
        tag="transition-group"
        :component-data="{
          attrs: {
            name: 'draggableCard',
            class: 'draggableCardList space-y-2',
          },
        }"
        item-key="cardId"
        :list="cardsForList"
        @end="onCardDragEnd"
        @error="handleDraggableError"
        :sort="true"
        animation="300"
        ghost-class="ghost"
        drag-class="dragging"
        :touch="true"
        :fallback-on-body="true"
        :force-fallback="true"
      >
        <template #default>
          <div
            v-for="card in cardsForList"
            :key="card.cardId"
            class="p-2 bg-gray-100 rounded-md"
          >
            <p class="text-sm font-medium">{{ card.cardName }}</p>
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
