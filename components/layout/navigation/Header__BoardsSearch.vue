<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";

const boardsStore = useBoardsStore();
const searchQuery = ref("");
const searchResults = ref<IBoard[]>([]);
const isLoading = ref(false);
const isDropdownOpen = ref(false);
const searchInput = ref<HTMLInputElement>();

// Закрытие при клике вне области
const handleClickOutside = (event: MouseEvent) => {
  if (searchInput.value && !searchInput.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Закрытие при ESC
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeDropdown();
  }
};

// Закрытие выпадающего списка
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Открытие выпадающего списка
const openDropdown = () => {
  if (searchResults.value.length > 0 || searchQuery.value.length > 0) {
    isDropdownOpen.value = true;
  }
};

// Оптимизированный поиск с задержкой 300мс
const performSearch = async (query: string) => {
  if (query.length < 2) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;
  try {
    searchResults.value = await boardsStore.searchBoards(query);
    openDropdown();
  } finally {
    isLoading.value = false;
  }
};

watch(searchQuery, (newVal) => {
  if (newVal) {
    performSearch(newVal);
  } else {
    searchResults.value = [];
    closeDropdown();
  }
});

const hasResults = computed(() => searchResults.value.length > 0);
const showNoResults = computed(
  () => searchQuery.value.length >= 2 && !isLoading.value && !hasResults.value
);

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div class="board-search relative">
    <UiInput
      v-model="searchQuery"
      placeholder="Search boards..."
      class="w-full h-9 pl-8"
      @focus="openDropdown"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-500" />
    </span>

    <Transition name="fade">
      <div
        v-if="isDropdownOpen && (hasResults || isLoading || showNoResults)"
        class="absolute z-40 mt-1 w-full rounded-md bg-newwhite shadow-lg"
      >
        <div v-if="isLoading" class="p-4 text-center text-sm text-gray-500">
          Searching...
        </div>
        <div
          v-else-if="showNoResults"
          class="p-4 text-center text-sm text-gray-500"
        >
          No boards found for "{{ searchQuery }}"
        </div>

        <ul v-else class="py-1 px-2 max-h-60 overflow-auto">
          <li
            v-for="board in searchResults"
            :key="board.boardId"
            class="p-2 mt-2 text-sm hover:bg-gray-200 rounded-sm cursor-pointer"
            @click="closeDropdown"
          >
            <NuxtLink
              :to="`/board/${board.boardId}`"
              class="flex items-center space-x-2"
              @click="searchQuery = ''"
            >
              <span>{{ board.boardName }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  transform-origin: top center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.board-search :deep(.input-prefix) {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
