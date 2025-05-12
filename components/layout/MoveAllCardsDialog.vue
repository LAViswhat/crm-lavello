<script setup lang="ts">
import { ref, computed } from "vue";
import { useBoardListsStore } from "@/stores/boardLists";
import { useListCardsStore } from "@/stores/listCards";

const props = defineProps<{
  boardId: string;
  listId: string;
}>();

const boardListsStore = useBoardListsStore();
const listCardsStore = useListCardsStore();

const popoverIsOpen = ref(false);
const selectedListId = ref<string | null>(props.listId); // По умолчанию текущий список

const currentList = computed(() => {
  return boardListsStore.boardLists.find(
    (list) => list.listId === props.listId
  );
});

// Получаем список всех доступных списков, кроме текущего
const availableLists = computed(() => {
  return boardListsStore.boardLists.filter(
    (list) => list.listId !== props.listId
  );
});

// Метод для перемещения всех карточек
const moveAllCards = async () => {
  if (!selectedListId.value || selectedListId.value === props.listId) return;

  const cardsToMove = listCardsStore.getCardsForList(props.listId).value;
  const targetCards = listCardsStore.getCardsForList(
    selectedListId.value
  ).value;

  // Создаем новый порядок для всех карточек в целевом списке
  const updatedTargetCards = [...targetCards, ...cardsToMove].map(
    (card, index) => ({
      ...card,
      listId: selectedListId.value!,
      order: index,
    })
  );

  try {
    // Обновляем порядок карточек в сторе
    await listCardsStore.updateCardOrder(
      props.boardId,
      selectedListId.value,
      updatedTargetCards
    );

    // Закрываем поповер
    popoverIsOpen.value = false;
  } catch (error) {
    console.error("Error moving all cards:", error);
  }
};
</script>

<template>
  <UiPopover v-model:open="popoverIsOpen">
    <UiPopoverTrigger class="text-left" v-if="availableLists.length >= 1">
      <slot name="trigger">
        <UiButton size="sm" variant="default">Move All Cards</UiButton>
      </slot>
    </UiPopoverTrigger>
    <UiPopoverContent side="bottom">
      <div class="flex flex-col gap-4 p-4">
        <UiLabel for="list-select">Choose list</UiLabel>
        <UiSelect id="order-select" v-model="selectedListId" class="w-full">
          <UiSelectTrigger>
            <UiSelectValue :placeholder="`From: ${currentList?.listName}`" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem
                v-for="list in availableLists"
                :key="list.listId"
                :value="list.listId"
              >
                To: {{ list.listName }}
              </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>
        <UiButton
          variant="default"
          :disabled="selectedListId === props.listId"
          @click="moveAllCards"
        >
          Move cards
        </UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>

<style scoped></style>
