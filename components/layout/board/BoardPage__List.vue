<script setup lang="ts">
import { type IBoardList } from "@/stores/boardLists";

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

onMounted(() => {
  if (props.isEditing && inputRef.value) {
    inputRef.value.focus();
  }
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
    <LayoutCardsListCards :board-id="boardId" :list-id="list.listId" />
    <UiCardFooter class="justify-center">
      <LayoutCardsCardCreator
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
