<script setup lang="ts">
const props = defineProps<{
  boardId: string;
  boardLists: IBoardList[];
}>();

const emit = defineEmits<{
  (e: "update:filteredLists", value: IBoardList[]): void;
  (e: "update:cardFilters", value: Map<string, string[]>): void;
}>();

const boardListsStore = useBoardListsStore();
const listCardsStore = useListCardsStore();

const searchQuery = ref("");
const badgeFilter = ref<number[]>([]);

// Основная функция фильтрации
const applyAllFilters = () => {
  if (!props.boardId) {
    emit("update:filteredLists", []);
    emit("update:cardFilters", new Map());
    return;
  }

  let result;

  // Фильтрация по поиску
  if (searchQuery.value.length >= 2) {
    result = boardListsStore.searchListsAndCards(
      props.boardId,
      searchQuery.value
    );
  } else {
    result = {
      filteredLists: [...props.boardLists],
      cardFilters: new Map<string, string[]>(),
    };
  }

  // Фильтрация по бейджам
  if (badgeFilter.value.length > 0) {
    const badgeResult = filterByBadges(result.filteredLists, badgeFilter.value);
    result = {
      filteredLists: badgeResult.filteredLists,
      cardFilters: mergeFilters(result.cardFilters, badgeResult.cardFilters),
    };
  }

  emit("update:filteredLists", result.filteredLists);
  emit("update:cardFilters", result.cardFilters);
};

// Фильтрация по бейджам
const filterByBadges = (lists: IBoardList[], badgeIndices: number[]) => {
  if (badgeIndices.length === 0) {
    return { filteredLists: lists, cardFilters: new Map() };
  }

  const filteredLists: IBoardList[] = [];
  const cardFilters = new Map<string, string[]>();

  lists.forEach((list) => {
    const cards = listCardsStore.getCardsForList(list.listId).value;
    const matchingCards = cards
      .filter((card) =>
        badgeIndices.some((idx) => card.info?.badgesChecked?.[idx])
      )
      .map((card) => card.id);

    if (matchingCards.length > 0) {
      filteredLists.push(list);
      cardFilters.set(list.listId, matchingCards);
    }
  });

  return { filteredLists, cardFilters };
};

// Объединение фильтров
const mergeFilters = (
  searchFilters: Map<string, string[]>,
  badgeFilters: Map<string, string[]>
) => {
  const merged = new Map<string, string[]>();

  if (searchFilters.size === 0) return badgeFilters;
  if (badgeFilters.size === 0) return searchFilters;

  for (const [listId, searchCards] of searchFilters) {
    const badgeCards = badgeFilters.get(listId) || [];
    const intersection = searchCards.filter((id) => badgeCards.includes(id));
    if (intersection.length > 0) {
      merged.set(listId, intersection);
    }
  }

  return merged;
};

// Следим за изменениями
watch(
  [searchQuery, badgeFilter, () => props.boardLists],
  () => {
    applyAllFilters();
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="flex justify-between items-center gap-1 lg:gap-8 mr-4 z-20">
    <LayoutBadgeFilter
      :board-id="boardId"
      @update:filter="(val) => (badgeFilter = val)"
    />
    <LayoutListAndCardSearch v-model:query="searchQuery" />
  </div>
</template>
