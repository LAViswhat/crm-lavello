<script setup lang="ts">
const props = defineProps<{
  boardId: string;
  boardName: string | undefined;
  boardDescription: string | undefined;
  boardCreatedAt: Date | null;
}>();
</script>

<template>
  <div
    class="relative h-32 w-60 overflow-hidden p-2 flex flex-col items-start justify-start gap-2 rounded-lg text-lg font-medium ring-offset-white transition-colors focus-visible:outline-none duration-500 shadow-xl dark:border-gray-800 dark:bg-gray-950 hover:brightness-[0.9]"
  >
    <LayoutBoardsBoardCardAboutSheet
      :board-name="boardName"
      :board-description="boardDescription"
      :board-created-at="boardCreatedAt"
    />
    <LayoutBoardsBoardDialog mode="edit" :board-id="props.boardId">
      <template #trigger
        ><UiTooltipProvider>
          <UiTooltip>
            <UiTooltipTrigger
              as-child
              class="absolute top-0 right-0 -translate-x-2 translate-y-1 text-newblack hover:text-gray-600"
              ><Icon
                name="mdi:text-box-edit-outline"
                size="18"
                class="text-newblack"
            /></UiTooltipTrigger>
            <UiTooltipContent>
              <p class="m-0">Edit board</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
      </template>
    </LayoutBoardsBoardDialog>
    <LayoutBoardsBoardCardRemoveDialog :board-id="props.boardId">
      <template #alertTrigger
        ><UiTooltipProvider>
          <UiTooltip>
            <UiTooltipTrigger
              as-child
              class="absolute top-full right-0 -translate-x-2 -translate-y-[120%] text-newblack hover:text-gray-600"
              ><Icon name="wpf:full-trash" size="18"
            /></UiTooltipTrigger>
            <UiTooltipContent>
              <p class="m-0">Remove board</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
      </template>
    </LayoutBoardsBoardCardRemoveDialog>
    <slot />
  </div>
</template>

<style scoped></style>
