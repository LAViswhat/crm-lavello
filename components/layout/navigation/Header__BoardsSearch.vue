<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";

const boardsStore = useBoardsStore();
const searchQuery = ref("");
const searchResults = ref<IBoard[]>([]);
const isLoading = ref(false);
const isOpen = ref(false);

const performSearch = async (query: string) => {
  if (query.length < 2) {
    searchResults.value = [];
    isOpen.value = false;
    return;
  }

  isLoading.value = true;
  isOpen.value = true;
  try {
    searchResults.value = await boardsStore.searchBoards(query);
  } finally {
    isLoading.value = false;
  }
};

watch(searchQuery, (newVal) => {
  if (newVal) {
    performSearch(newVal);
  } else {
    searchResults.value = [];
  }
});
</script>

<template>
  <UiPopover v-model:open="isOpen">
    <UiPopoverTrigger as-child>
      <div class="relative w-full">
        <UiInput
          v-model="searchQuery"
          placeholder="Search boards..."
          class="w-full lg:min-w-64 h-9 pl-8"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
        >
          <Icon
            name="heroicons:magnifying-glass"
            class="h-5 w-5 text-gray-500"
          />
        </span>
      </div>
    </UiPopoverTrigger>

    <UiPopoverContent
      class="w-full lg:min-w-64 p-2"
      align="center"
      :side-offset="4"
    >
      <div
        v-if="isLoading"
        class="p-4 w-full text-sm text-center text-muted-foreground"
      >
        Searching...
      </div>

      <div
        v-else-if="searchResults.length === 0"
        class="p-4 text-sm text-center text-muted-foreground"
      >
        No boards found
      </div>

      <div v-else>
        <NuxtLink
          v-for="board in searchResults"
          :key="board.boardId"
          :to="`/board/${board.boardId}`"
          class="block p-2 rounded-sm text-sm hover:bg-accent"
          @click="isOpen = false"
        >
          {{ board.boardName }}
        </NuxtLink>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>

<style scoped></style>
