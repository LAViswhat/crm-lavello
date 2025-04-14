<script setup lang="ts">
import { useBoardsStore, type IBoard } from "@/stores/boards";
import { Timestamp } from "firebase/firestore";

definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const boardStore = useBoardsStore();
const board = ref<IBoard | null>();

onMounted(async () => {
  await boardStore.getBoards();
  board.value = await boardStore.getBoard(route.params.id as string);
  if (!board.value) {
    await router.push("/dashboard");
  }
});

watchEffect(async () => {
  if (board.value) {
    const updatedBoard = await boardStore.getBoard(board.value.boardId);
    if (updatedBoard) {
      board.value = updatedBoard;
    }
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
    <div class="board-canvas p-2 h-svh flex-grow">
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet
        exercitationem placeat impedit consequuntur maxime nostrum in cumque,
        aspernatur quidem sint repellendus, asperiores temporibus error sed eos
        corporis excepturi odit est!
      </p>
    </div>
  </div>
</template>

<style scoped></style>
