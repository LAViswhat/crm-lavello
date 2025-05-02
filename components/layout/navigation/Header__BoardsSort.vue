<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";

const boardStore = useBoardsStore();
const selectedValue = ref({
  option: boardStore.sortOption,
  direction: boardStore.sortDirection,
});

const sortOptions = [
  {
    value: {
      option: "createdAt",
      direction: "desc",
    },
    label: "Date created (Newest first)",
  },
  {
    value: {
      option: "createdAt",
      direction: "asc",
    },
    label: "Date created (Oldest first)",
  },
  {
    value: {
      option: "editedAt",
      direction: "desc",
    },
    label: "Most active recently",
  },
  {
    value: {
      option: "editedAt",
      direction: "asc",
    },
    label: "Least active recently",
  },
  {
    value: {
      option: "boardName",
      direction: "desc",
    },
    label: "Name (A-Z)",
  },
  {
    value: {
      option: "boardName",
      direction: "asc",
    },
    label: "Name (Z-A)",
  },
];

const handleValueChange = (value: any) => {
  if (value && value.option && value.direction) {
    console.log("Sort option changed to:", value);
    selectedValue.value = value;
    boardStore.sortOption = value.option;
    boardStore.sortDirection = value.direction;
    boardStore.sortBoards();
  }
};
</script>

<template>
  <UiSelect v-model="selectedValue" @update:modelValue="handleValueChange">
    <UiSelectTrigger class="text-newwhite w-full md:w-44 md:min-w-44">
      <UiSelectValue placeholder="Sort by" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectGroup>
        <UiSelectItem
          v-for="option in sortOptions"
          :key="option.value.option"
          :value="option.value"
        >
          {{ option.label }}
        </UiSelectItem>
      </UiSelectGroup>
    </UiSelectContent>
  </UiSelect>
</template>
