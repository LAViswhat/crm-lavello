<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
const props = defineProps<{
  boardName: string | undefined;
  boardDescription: string | undefined;
  boardCreatedAt: Date | null;
}>();

const formatDate = (date: string | Date | Timestamp | null) => {
  if (!date) return "Unknown"; // Обработка null

  if (typeof date === "string") {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? "Invalid Date"
      : parsedDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  }
  if (date instanceof Date) {
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (date && typeof date.toDate === "function") {
    return date.toDate().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};
</script>
<template>
  <UiSheetContent class="w-72">
    <UiSheetHeader>
      <UiSheetTitle>{{ props.boardName }}</UiSheetTitle>
    </UiSheetHeader>
    <div>
      <UiSheetDescription> {{ props.boardDescription }}</UiSheetDescription>
    </div>
    <UiSheetFooter>
      <div class="flex items-center pt-2">
        <Icon name="solar:calendar-broken" class="mr-2 h-6 w-6" />
        <span class="text-xs">
          Created: {{ formatDate(props.boardCreatedAt) }}
        </span>
      </div>
    </UiSheetFooter>
  </UiSheetContent>
</template>

<style scoped></style>
