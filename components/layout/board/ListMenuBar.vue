<script setup lang="ts">
const props = defineProps<{
  boardId: string;
  listId?: string;
}>();

const boardListsStore = useBoardListsStore();
const isLoading = ref(false);

const handleDeleteList = async () => {
  if (props.listId) {
    isLoading.value = true; // Включаем загрузку
    try {
      await boardListsStore.deleteList(props.boardId, props.listId);
    } catch (error) {
      console.error("Error deleting list:", error);
    } finally {
      isLoading.value = false; // Выключаем загрузку
    }
  }
};
</script>

<template>
  <UiMenubar class="bg-transparent">
    <LayoutLoader v-if="isLoading" />
    <UiMenubarMenu v-else>
      <UiMenubarTrigger
        class="hover:bg-gray-400/30 data-[state=open]:bg-gray-400/50 p-1"
      >
        <Icon name="lineicons:menu-meatballs-1" size="22" />
      </UiMenubarTrigger>
      <UiMenubarContent
        side="bottom"
        class="bg-newwhite border-0 w-full flex flex-col py-4 cursor-default"
      >
        <UiMenubarItem as-child>
          <LayoutCardCreator :board-id="boardId" :list-id="listId">
            <span class="text-sm pl-2">Add a new card</span>
          </LayoutCardCreator>
        </UiMenubarItem>
        <UiMenubarSeparator class="bg-0" />
        <UiMenubarItem as-child>
          <span>Переместить список</span>
        </UiMenubarItem>
        <UiMenubarSeparator class="bg-0" />
        <UiMenubarItem as-child>
          <LayoutRemoveDialog
            :board-id="boardId"
            :description="`This action cannot be undone. This will permanently delete this list and all it's cards from this board.`"
            :onRemove="handleDeleteList"
          >
            <template #alertTrigger>
              <div class="text-left cursor-default">
                <span class="text-sm pl-2">Delete list</span>
              </div>
            </template>
          </LayoutRemoveDialog>
        </UiMenubarItem>
      </UiMenubarContent>
    </UiMenubarMenu>
  </UiMenubar>
</template>

<style scoped></style>
