<script setup lang="ts">
import { useFormatDate } from "@/composables/useFormatDate";
const props = defineProps<{
  boardName: string | undefined;
  boardDescription: string | undefined;
  boardCreatedAt: Date | null;
  boardEditedAt: Date | null;
}>();

const { formatDate } = useFormatDate();
</script>
<template>
  <UiSheetContent class="w-72">
    <UiSheetHeader>
      <UiSheetTitle>{{ props.boardName }}</UiSheetTitle>
    </UiSheetHeader>
    <div>
      <UiSheetDescription> {{ props.boardDescription }}</UiSheetDescription>
    </div>
    <UiSheetFooter class="flex !flex-col">
      <div class="flex items-center text-secondary pt-2">
        <Icon name="hugeicons:property-edit" class="mr-2 h-6 w-6" />
        <span class="text-xs">
          Last update: {{ formatDate(props.boardEditedAt) }}
        </span>
      </div>
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
