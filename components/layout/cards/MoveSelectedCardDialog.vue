<script setup lang="ts">
const props = defineProps<{
  boardId: string;
  listId: string;
  cardId: string;
}>();

const boardListsStore = useBoardListsStore();
const listCardsStore = useListCardsStore();

const popoverIsOpen = ref(false);
const selectedListId = ref<string>(props.listId); // По умолчанию текущий список
const selectedOrder = ref<number>(0); // По умолчанию текущий порядок карточки

// Получаем текущую карточку
const currentCard = computed(() => {
  return listCardsStore.allCards.get(props.cardId);
});

// Получаем текущий список
const currentList = computed(() => {
  return boardListsStore.boardLists.find(
    (list) => list.listId === props.listId
  );
});

// Получаем список всех доступных списков
const availableLists = computed(() => {
  return boardListsStore.boardLists;
});

// Обновляем доступные порядки карточек при изменении выбранного списка
const availableOrders = computed(() => {
  const targetCards = listCardsStore.getCardsForList(
    selectedListId.value
  ).value;

  // Если в списке только одна карточка, возвращаем только текущий порядок
  if (
    currentList.value?.listId === selectedListId.value &&
    targetCards.length === 1
  ) {
    return [currentCard.value?.order ?? 0];
  }

  // Иначе возвращаем все возможные порядки
  return Array.from({ length: targetCards.length + 1 }, (_, i) => i);
});

// Устанавливаем текущий порядок карточки
watch(
  () => props.cardId,
  () => {
    const card = currentCard.value;
    if (card) {
      selectedOrder.value = card.order + 1;
    }
  },
  { immediate: true }
);

// Метод для перемещения карточки
const moveCard = async () => {
  if (!currentCard.value || !selectedListId.value) return;

  try {
    await listCardsStore.moveCardToList(
      props.boardId,
      props.cardId,
      selectedListId.value,
      selectedOrder.value
    );

    // Закрываем поповер
    popoverIsOpen.value = false;
  } catch (error) {
    console.error("Error moving card:", error);
  }
};
</script>

<template>
  <UiPopover v-model:open="popoverIsOpen">
    <UiPopoverTrigger class="text-left">
      <slot name="trigger">
        <Icon name="ic:round-move-up" size="16" />
      </slot>
    </UiPopoverTrigger>
    <UiPopoverContent side="right">
      <div class="flex flex-col gap-4 p-4">
        <!-- Селект для выбора списка -->
        <UiLabel for="list-select">Choose list</UiLabel>
        <UiSelect id="list-select" v-model="selectedListId" class="w-full">
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
                {{ list.listName }}
              </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>

        <!-- Селект для выбора порядка -->
        <UiLabel for="order-select">Choose position</UiLabel>
        <UiSelect id="order-select" v-model="selectedOrder" class="w-full">
          <UiSelectTrigger>
            <UiSelectValue :placeholder="`Order: ${selectedOrder}`" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem
                v-for="order in availableOrders"
                :key="order"
                :value="order"
              >
                {{ order + 1 }}
              </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>

        <!-- Кнопка для перемещения карточки -->
        <UiButton
          variant="default"
          :disabled="
            selectedListId === props.listId &&
            selectedOrder === currentCard?.order
          "
          @click="moveCard"
        >
          Move card
        </UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>

<style scoped></style>
