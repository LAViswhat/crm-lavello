<script setup lang="ts">
import { type IBoardList } from "@/stores/boardLists";
import { useListCardsStore, type IListCard } from "@/stores/listCards";

const props = defineProps<{
  list: IBoardList;
  isEditing: boolean;
  tempListName: string;
  boardId?: string;
}>();

defineEmits<{
  (e: "startEditing", list: IBoardList): void;
  (e: "saveListName", listId: string): void;
  (e: "cancelEditing"): void;
  (e: "keydown", event: KeyboardEvent, listId: string): void;
  (e: "update:tempListName", value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const listCardsStore = useListCardsStore();
const { listCards } = storeToRefs(listCardsStore);

onMounted(() => {
  if (props.isEditing && inputRef.value) {
    inputRef.value.focus();
  }
  if (props.boardId && props.list.listId) {
    listCardsStore.getListCards(props.boardId, props.list.listId);
  }
});

const cardsForList = computed(() => {
  return listCards.value.get(props.list.listId) || [];
});
</script>
<template>
  <UiCard class="draggableCard h-fit w-[268px]">
    <UiCardHeader class="pb-2">
      <div v-if="isEditing">
        <UiInput
          :model-value="tempListName"
          @update:model-value="$emit('update:tempListName', String($event))"
          type="text"
          class="text-lg font-bold text-newblack w-full bg-transparent border-b border-primary focus:outline-none focus:border-primary"
          @blur="$emit('saveListName', list.listId)"
          @keydown="$emit('keydown', $event, list.listId)"
          ref="inputRef"
          autofocus
        />
      </div>
      <UiCardTitle v-else @click="$emit('startEditing', list)">
        {{ list.listName }}
      </UiCardTitle>
      <UiCardDescription>
        Created: {{ list.createdAt.toLocaleDateString() }}
      </UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="p-2">
      <div v-if="cardsForList.length > 0" class="space-y-2">
        <div
          v-for="card in cardsForList"
          :key="card.cardId"
          class="p-2 pr-4 bg-gray-100/70 rounded-md"
        >
          <p class="text-sm font-normal">{{ card.cardName }}</p>
        </div>
      </div>
      <p v-else class="text-gray-500">No cards yet</p>
    </UiCardContent>
    <UiCardFooter class="justify-center">
      <LayoutBoardCardCreator
        :board-id="boardId || ''"
        :list-id="list?.listId || ''"
      />
    </UiCardFooter>
  </UiCard>
</template>

<style scoped>
.draggableCard {
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  user-select: none;
}

.draggableCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: grab;
}
</style>
