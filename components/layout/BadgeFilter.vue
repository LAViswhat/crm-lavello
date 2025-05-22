<script setup lang="ts">
const props = defineProps<{ boardId: string }>();
const emit = defineEmits(["update:filter"]);

const listCardsStore = useListCardsStore();

// Собираем уникальные badge по индексу (до 4 badge)
const badges = computed(() => {
  const result: { background: string; idx: number }[] = [];
  for (let idx = 0; idx < 4; idx++) {
    const background = getCommonBadgeBackground(idx);
    if (background) {
      result.push({ background, idx });
    }
  }
  return result;
});

const getCommonBadgeBackground = (idx: number) => {
  for (const card of listCardsStore.allCards.values()) {
    if (card.boardId !== props.boardId) continue;
    const badge = card.info?.badges?.[idx];
    if (badge?.background) {
      return badge.background;
    }
  }
  return null;
};

const checked = ref<boolean[]>([false, false, false, false]);

watch(
  checked,
  (newVal) => {
    const selected = newVal
      .map((isChecked, idx) => (isChecked ? idx : null))
      .filter((v) => v !== null) as number[];
    emit("update:filter", selected);
  },
  { deep: true }
);
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger class="z-20 text-newwhite">
      <span class="flex items-center gap-0.5 text-sm">
        <Icon name="tabler:filter-heart" size="24" />Filter by badges</span
      >
    </UiPopoverTrigger>
    <UiPopoverContent class="max-w-52">
      <div class="flex flex-col items-center gap-2">
        <div
          v-for="(badge, idx) in badges"
          :key="badge.background + badge.idx"
          class="flex items-center gap-1"
        >
          <UiCheckbox :id="`badge-check-${idx}`" v-model="checked[idx]" />
          <UiLabel
            :for="`badge-check-${idx}`"
            class="w-40 h-6 rounded-sm flex items-center px-2 text-xs cursor-pointer"
            :style="{ background: badge.background }"
          ></UiLabel>
        </div>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
