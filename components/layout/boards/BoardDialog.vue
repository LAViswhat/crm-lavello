<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  mode: "create" | "edit";
  boardId?: string;
}>();

const isOpen = ref(false);

const handleClose = () => {
  isOpen.value = false;
};
</script>
<template>
  <UiDialog v-model:open="isOpen">
    <UiDialogTrigger>
      <slot name="trigger" />
    </UiDialogTrigger>
    <LayoutBoardsBoardDialogContent
      :mode="props.mode"
      :board-id="props.boardId"
      @close="handleClose"
    />
  </UiDialog>
</template>

<style scoped></style>
