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
const boardLists = ref<IBoardList[]>([]);

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
</script>

<template>
  <LayoutLoader v-if="boardStore.loader" />
  <div
    v-else
    class="board-main-content flex flex-col min-h-full duration-300"
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
    <div class="board-canvas mt-8 px-8 flex-grow">
      <LayoutBoardListCreator :board-id="board?.boardId" />
      <ClientOnly>
        <LayoutBoardDraggableLists
          :board-id="board?.boardId"
          :lists="boardLists"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped></style>
