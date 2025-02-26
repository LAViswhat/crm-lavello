<script setup lang="ts">
const props = defineProps<{
  mode: "create" | "edit";
  boardId?: string;
}>();
</script>
<template>
  <UiDialog>
    <UiDialogTrigger>
      <slot name="trigger" />
    </UiDialogTrigger>
    <LayoutBoardsBoardDialogContent
      :mode="props.mode"
      :board-id="props.boardId"
    />
  </UiDialog>
</template>

<style scoped></style>
