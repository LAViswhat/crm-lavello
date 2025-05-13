<script setup lang="ts">
const props = defineProps<{
  boardId: string;
  listId?: string;
}>();

const boardListsStore = useBoardListsStore();
const listCardsStore = useListCardsStore();
const isLoading = ref(false);

const handleDeleteList = async () => {
  if (props.listId) {
    isLoading.value = true;
    try {
      await boardListsStore.deleteList(props.boardId, props.listId);
    } catch (error) {
      console.error("Error deleting list:", error);
    } finally {
      isLoading.value = false;
    }
  }
};

const handleDeleteAllCardsInList = async () => {
  if (props.listId) {
    isLoading.value = true;
    try {
      await listCardsStore.deleteAllCardsInList(props.boardId, props.listId);
    } catch (error) {
      console.error("Error deleting all cards in list:", error);
    } finally {
      isLoading.value = false;
    }
  }
};

const hasCards = computed(() => {
  if (!props.listId) return false;
  const cards = listCardsStore.allCards;
  return Array.from(cards.values()).some(
    (card) => card.listId === props.listId
  );
});
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
        class="bg-newwhite border-0 w-full flex flex-col gap-0.5 py-4 px-2 cursor-pointer"
      >
        <UiMenubarItem as-child>
          <LayoutCardCreator :board-id="boardId" :list-id="listId">
            <span
              class="text-sm px-2 h-8 flex items-center hover:bg-white rounded-sm"
              >Add a new card</span
            >
          </LayoutCardCreator>
        </UiMenubarItem>
        <UiMenubarItem as-child>
          <LayoutChangeListOrderDialog :board-id="boardId" :list-id="listId">
            <template #trigger>
              <div
                class="w-full h-8 flex items-center hover:bg-white rounded-sm"
              >
                <span class="text-sm px-2">Change order of the list</span>
              </div>
            </template>
          </LayoutChangeListOrderDialog>
        </UiMenubarItem>
        <UiMenubarItem as-child v-if="hasCards">
          <LayoutMoveAllCardsDialog :board-id="boardId" :list-id="listId || ''">
            <template #trigger>
              <div
                class="w-full h-8 flex items-center hover:bg-white rounded-sm"
              >
                <span class="text-sm px-2">Move all cards</span>
              </div>
            </template>
          </LayoutMoveAllCardsDialog>
        </UiMenubarItem>
        <UiMenubarItem as-child v-if="hasCards">
          <LayoutRemoveDialog
            :board-id="boardId"
            :description="`This action cannot be undone. This will permanently delete all cards from this list.`"
            :onRemove="handleDeleteAllCardsInList"
          >
            <template #alertTrigger>
              <div
                class="text-left cursor-pointer w-full h-8 flex items-center hover:bg-white rounded-sm"
              >
                <span class="text-sm px-2">Remove all cards from the list</span>
              </div>
            </template>
          </LayoutRemoveDialog>
        </UiMenubarItem>
        <UiMenubarItem as-child>
          <LayoutRemoveDialog
            :board-id="boardId"
            :description="`This action cannot be undone. This will permanently delete this list and all it's cards from this board.`"
            :onRemove="handleDeleteList"
          >
            <template #alertTrigger>
              <div
                class="text-left cursor-pointer w-full h-8 flex items-center hover:bg-white rounded-sm"
              >
                <span class="text-sm px-2">Delete list</span>
              </div>
            </template>
          </LayoutRemoveDialog>
        </UiMenubarItem>
      </UiMenubarContent>
    </UiMenubarMenu>
  </UiMenubar>
</template>

<style scoped></style>
