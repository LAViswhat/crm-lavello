<script setup lang="ts">
import { ref, watch } from "vue";
import { debounce } from "lodash";

const searchQuery = ref("");
const emit = defineEmits<{
  (e: "update:query", value: string): void;
}>();

// Debounce search input to emit query
const debouncedSearch = debounce((value: string) => {
  emit("update:query", value.trim());
}, 300);

watch(searchQuery, (newValue) => {
  debouncedSearch(newValue);
});
</script>

<template>
  <div class="relative">
    <UiInput
      v-model="searchQuery"
      placeholder="Search lists and cards..."
      class="w-full p-2 pl-8 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
    /><span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-500" />
    </span>
  </div>
</template>
