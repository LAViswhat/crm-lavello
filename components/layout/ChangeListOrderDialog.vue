<script setup lang="ts">
import { ref, computed } from "vue";
import { useBoardListsStore } from "@/stores/boardLists";

const props = defineProps<{
  boardId: string;
  listId?: string;
}>();

const boardListsStore = useBoardListsStore();
const popoverIsOpen = ref(false);
const selectedOrder = ref<number | null>(null); // Выбранный порядок
const availableOrders = computed(() => {
  // Получаем список всех порядков, кроме текущего
  const currentList = boardListsStore.boardLists.find(
    (list) => list.listId === props.listId
  );
  if (!currentList) return [];
  return boardListsStore.boardLists
    .filter((list) => list.listId !== props.listId)
    .map((list) => list.order)
    .concat(currentList.order) // Добавляем текущий порядок
    .sort((a, b) => a - b); // Сортируем по возрастанию
});

// Устанавливаем текущий порядок по умолчанию
const currentOrder = computed(() => {
  const list = boardListsStore.boardLists.find(
    (list) => list.listId === props.listId
  );
  return list?.order ?? 0;
});
selectedOrder.value = currentOrder.value;

// Метод для изменения порядка списка
const changeOrder = async () => {
  if (
    selectedOrder.value === null ||
    selectedOrder.value === currentOrder.value
  )
    return;

  const { boardLists } = toRefs(boardListsStore);
  const reorderedLists = boardLists.value.map((list) => ({
    ...list,
  }));
  const currentListIndex = reorderedLists.findIndex(
    (list) => list.listId === props.listId
  );

  if (currentListIndex === -1) return;

  // Обновляем порядок текущего списка
  reorderedLists[currentListIndex].order = selectedOrder.value;

  // Обновляем порядок других списков
  reorderedLists.forEach((list) => {
    if (list.listId !== props.listId && list.order === selectedOrder.value) {
      list.order = currentOrder.value;
    }
  });

  // Сортируем списки по новому порядку
  reorderedLists.sort((a, b) => a.order - b.order);

  // Вызываем метод для обновления порядка в сторе
  await boardListsStore.updateBoardListOrder(props.boardId, reorderedLists);

  popoverIsOpen.value = false; // Закрываем поповер
};
</script>

<template>
  <UiPopover v-model:open="popoverIsOpen">
    <UiPopoverTrigger class="text-left">
      <slot name="trigger">
        <UiButton size="sm" variant="default">Change Order</UiButton>
      </slot>
    </UiPopoverTrigger>
    <UiPopoverContent side="bottom">
      <div class="flex flex-col gap-4 p-4">
        <UiLabel for="order-select">Choose new position</UiLabel>
        <UiSelect id="order-select" v-model="selectedOrder" class="w-full">
          <UiSelectTrigger>
            <UiSelectValue :placeholder="`Позиция ${currentOrder}`" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem
                v-for="order in availableOrders"
                :key="order"
                :value="order"
              >
                {{ order }}
              </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>
        <UiButton
          variant="default"
          :disabled="selectedOrder === currentOrder"
          @click="changeOrder"
        >
          Move
        </UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>

<style scoped></style>
