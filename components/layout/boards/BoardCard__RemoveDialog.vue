<script setup lang="ts">
import { useBoardsStore } from "~/stores/boards";

const boardStore = useBoardsStore();
const props = defineProps<{
  boardId: string;
}>();
</script>
<template>
  <UiAlertDialog>
    <UiAlertDialogTrigger>
      <slot name="alertTrigger" />
    </UiAlertDialogTrigger>
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle class="normal-case"
          >Are you absolutely sure?</UiAlertDialogTitle
        >
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently delete this board
          and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel>Cancel</UiAlertDialogCancel>
        <UiAlertDialogAction @click="boardStore.removeBoard(props.boardId)"
          >Remove</UiAlertDialogAction
        >
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style scoped></style>
