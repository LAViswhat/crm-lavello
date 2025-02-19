<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const boardStore = useBoardsStore();
const boardList = computed(() => boardStore.boards);

onMounted(async () => {
  await authStore.waitForAuthState();
  await boardStore.getBoards();
});

// Функция для форматирования даты
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
<template>
  <LayoutLoader v-if="boardStore.loader" />
  <div v-else class="flex flex-row flex-wrap gap-4">
    <LayoutBoardsBoardDialog mode="create">
      <template #trigger>
        <UiButton
          variant="outline"
          size="md"
          class="min-h-32 min-w-60 border-0 shadow-xl focus-visible:ring-offset-0 focus-visible:ring-transparent"
        >
          <Icon
            name="fluent:slide-add-32-regular"
            size="32"
            class="text-primary"
          />
          <span>Create new board</span>
        </UiButton>
      </template>
    </LayoutBoardsBoardDialog>
    <div v-for="board in boardList">
      <UiHoverCard :openDelay="150">
        <UiHoverCardTrigger as-child>
          <LayoutBoardsBoardCard
            :boardId="board.boardId"
            :key="board.boardId"
            :style="{ 'background-image': board.gradient }"
          >
            <h4
              class="pt-2"
              :class="[board.gradient ? 'text-gray-200' : 'text-primary']"
            >
              {{ board.boardName }}
            </h4>
          </LayoutBoardsBoardCard>
        </UiHoverCardTrigger>
        <UiHoverCardContent>
          <div class="flex justify-between space-x-4">
            <div class="space-y-1">
              <h4 class="text-md mb-0">{{ board.boardName }}</h4>
              <p class="text-sm">
                {{ board.boardDescription }}
              </p>
              <div class="flex items-center pt-2">
                <Icon name="solar:calendar-broken" class="mr-2 h-6 w-6" />
                <span class="text-xs">
                  Created: {{ formatDate(board.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </UiHoverCardContent>
      </UiHoverCard>
    </div>
  </div>
</template>

<style scoped></style>
