<script setup lang="ts">
defineProps<{
  card: {
    id: string;
    name: string;
    order: number;
    info: { description?: string };
  };
  boardId: string;
  listId: string;
}>();

const emit = defineEmits(["remove", "move"]);
</script>

<template>
  <div class="p-2 min-h-16 bg-gray-100 rounded-md relative draggableCard group">
    <div class="relative">
      <LayoutCardsCardEditorDialog
        :board-id="boardId"
        :card-id="card.id"
        @save="emit('move', $event)"
      >
        <template #editorTrigger>
          <div class="flex flex-row items-center gap-2 group">
            <Icon
              name="cuida:edit-outline"
              size="16"
              class="flex items-center cursor-pointer transition-all duration-300 ease-in-out opacity-100 xl:opacity-0 xl:w-0 xl:-ml-1 xl:group-hover:opacity-100 xl:group-hover:w-4 xl:group-hover:ml-0"
            />
            <p
              class="text-sm font-medium mb-0 transition-all duration-300 ease-in-out xl:group-hover:translate-x-2"
            >
              {{ card.name }}
            </p>
          </div>
        </template>
      </LayoutCardsCardEditorDialog>
      <UiTooltipProvider>
        <UiTooltip>
          <UiTooltipTrigger
            as-child
            class="absolute top-full translate-y-4 left-0 cursor-pointer hover:text-secondary"
            ><Icon
              v-if="card.info.description"
              name="fluent:text-description-20-filled"
              size="18"
              class="text-primary"
          /></UiTooltipTrigger>
          <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
            <p class="text-xs m-0">This card has description</p>
          </UiTooltipContent>
        </UiTooltip>
      </UiTooltipProvider>
    </div>
    <LayoutCardsMoveSelectedCardDialog
      :board-id="boardId"
      :card-id="card.id"
      :list-id="listId"
      class="absolute top-0 left-0 w-full h-full"
      @move="emit('move', $event)"
    >
      <template #trigger>
        <UiTooltipProvider>
          <UiTooltip>
            <UiTooltipTrigger
              as-child
              class="absolute top-[6px] right-[6px] cursor-pointer opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity"
              ><Icon name="ic:round-move-up" size="16"
            /></UiTooltipTrigger>
            <UiTooltipContent class="bg-gray-400 p-1" side="top">
              <p class="text-xs m-0">Move card</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
      </template>
    </LayoutCardsMoveSelectedCardDialog>
    <UiTooltipProvider>
      <UiTooltip>
        <UiTooltipTrigger
          @click="$emit('remove', card.id)"
          as-child
          class="absolute bottom-[6px] right-[6px] cursor-pointer opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity"
          ><Icon name="mdi:card-remove-outline" size="16"
        /></UiTooltipTrigger>
        <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
          <p class="text-xs m-0">Remove</p>
        </UiTooltipContent>
      </UiTooltip>
    </UiTooltipProvider>
  </div>
</template>

<style scoped>
.draggableCard:hover {
  background-color: #f3f6f4cc;
  transition: background-color 0.2s ease;
}
</style>
