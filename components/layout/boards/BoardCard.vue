<script setup lang="ts">
import { useBoardsStore } from "~/stores/boards";

const boardStore = useBoardsStore();
const props = defineProps<{
  boardId: string;
}>();
</script>

<template>
  <div
    class="relative h-32 w-60 overflow-hidden p-2 flex flex-col items-start justify-start gap-2 rounded-lg text-lg font-medium ring-offset-white transition-colors focus-visible:outline-none duration-500 shadow-xl dark:border-gray-800 dark:bg-gray-950"
  >
    <UiTooltipProvider>
      <UiTooltip>
        <UiTooltipTrigger
          as-child
          class="absolute top-0 right-0 -translate-x-1 translate-y-2 text-gray-500 cursor-pointer"
          ><Icon name="lucide:settings" size="18"
        /></UiTooltipTrigger>
        <UiTooltipContent>
          <p class="m-0">Settings</p>
        </UiTooltipContent>
      </UiTooltip>
    </UiTooltipProvider>

    <UiAlertDialog>
      <UiAlertDialogTrigger
        ><UiTooltipProvider>
          <UiTooltip>
            <UiTooltipTrigger
              as-child
              class="absolute top-full right-0 -translate-x-1 -translate-y-[120%] text-gray-500 cursor-pointer"
              ><Icon name="bi:trash2-fill" size="18"
            /></UiTooltipTrigger>
            <UiTooltipContent>
              <p class="m-0">Remove board</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider></UiAlertDialogTrigger
      >
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            board and remove your data from our servers.
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

    <slot />
  </div>
</template>

<style scoped></style>
