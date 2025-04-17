<script setup lang="ts">
import { useBoardsStore, type IBoard } from "@/stores/boards";
import { useBoardListsStore, type IBoardList } from "@/stores/boardLists";
import { Timestamp } from "firebase/firestore";

definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const boardStore = useBoardsStore();
const boardListsStore = useBoardListsStore();
const board = ref<IBoard | null>();
const listName = ref("");
const boardLists = ref<IBoardList[]>([]);
const popoverIsOpen = ref(false);

onMounted(async () => {
  await boardStore.getBoards();
  board.value = await boardStore.getBoard(route.params.id as string);
  if (!board.value) {
    await router.push("/dashboard");
  } else {
    await boardListsStore.getBoardLists(board.value.boardId);
    boardLists.value = boardListsStore.boardLists;
  }
});

watchEffect(async () => {
  if (board.value) {
    const updatedBoard = await boardStore.getBoard(board.value.boardId);
    if (updatedBoard) {
      board.value = updatedBoard;
    }
    await boardListsStore.getBoardLists(board.value.boardId);
    boardLists.value = boardListsStore.boardLists;
  }
});

const boardCreatedAt = computed(() => {
  if (board.value?.createdAt) {
    if (board.value.createdAt instanceof Timestamp) {
      return board.value.createdAt.toDate();
    }
    return board.value.createdAt as Date;
  }
  return null;
});

const createList = async () => {
  if (!listName.value.trim() || !board.value?.boardId) return;

  await boardListsStore.createList(board.value.boardId, listName.value.trim());
  listName.value = "";
  popoverIsOpen.value = false;
};
</script>
<template>
  <LayoutLoader v-if="boardStore.loader" />
  <div
    v-else
    class="board-main-content flex flex-col duration-300"
    :style="{ 'background-image': board?.gradient, opacity: board ? 1 : 0 }"
  >
    <div
      class="board-header h-16 flex flex-row justify-between items-center relative"
    >
      <LayoutBoardPageHeader
        :board-name="board?.boardName"
        :board-description="board?.boardDescription"
        :board-created-at="boardCreatedAt"
        :board-id="board?.boardId"
        class="bg-transparent"
      />
      <div class="absolute inset-0 bg-slate-500/50 z-10"></div>
    </div>
    <div class="board-canvas mt-8 px-8 h-svh flex-grow">
      <div class="flex gap-4">
        <UiPopover v-model:open="popoverIsOpen">
          <UiPopoverTrigger>
            <UiButton
              variant="outline"
              size="md"
              class="justify-start !min-w-64"
            >
              <Icon name="mynaui:plus" size="24" class="" />
              <span class="text-lg">Add a new list</span></UiButton
            >
          </UiPopoverTrigger>
          <UiPopoverContent>
            <div>
              <UiLabel for="name"></UiLabel>
              <UiInput
                id="name"
                type="text"
                placeholder="Enter the list name..."
                class="w-full mb-4"
                v-model="listName"
              />
            </div>
            <div class="flex justify-around items-center">
              <UiButton variant="default" @click="createList"
                >Add list</UiButton
              >
              <UiButton
                variant="ghost"
                size="icon"
                @click="popoverIsOpen = false"
              >
                <Icon
                  name="charm:cross"
                  size="32"
                  class="text-primary hover:text-secondary"
                />
              </UiButton>
            </div>
          </UiPopoverContent>
        </UiPopover>
      </div>
      <div class="lists-container mt-4 flex gap-4 flex-wrap">
        <div
          v-for="list in boardLists"
          :key="list.listId"
          class="list-card bg-newwhite p-4 rounded-md shadow-md min-w-[250px] max-w-[300px]"
        >
          <h3 class="text-lg font-bold text-newblack">{{ list.listName }}</h3>
          <p class="text-sm text-gray-500">
            Created: {{ list.createdAt.toLocaleDateString() }}
          </p>
          <div class="items-container mt-2">
            <!-- Placeholder for future items/tasks -->
            <p class="text-gray-400">No items yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-card {
  transition: all 0.2s ease-in-out;
}
.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
