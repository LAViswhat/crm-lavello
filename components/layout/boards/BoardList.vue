<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";

onMounted(async () => {
  await boardStore.getBoards();
});

const boardStore = useBoardsStore();
const boardList = computed(() => boardStore.boards);
</script>
<template>
  <LayoutLoader v-if="boardStore.loader" />
  <div v-else class="flex flex-row flex-wrap gap-4">
    <LayoutBoardsBoardDialog />
    <div v-for="board in boardList">
      <LayoutBoardsBoardCard :key="board.boardId">
        <h4 class="pt-2">{{ board.boardName }}</h4>
        <p class="text-sm text-gray-500">
          {{ board.boardDescription }}
        </p>
      </LayoutBoardsBoardCard>
    </div>
  </div>
</template>

<style scoped></style>
