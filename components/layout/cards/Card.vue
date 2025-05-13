<script setup lang="ts">
const props = defineProps<{
  card: {
    id: string;
    name: string;
    order: number;
  };
  boardId: string;
  listId: string;
}>();

const emit = defineEmits(["remove", "move"]);
</script>

<template>
  <div class="p-2 min-h-16 bg-gray-100 rounded-md relative group">
    <div class="flex flex-row items-center gap-2 group">
      <Icon
        name="cuida:edit-outline"
        size="16"
        class="cursor-pointer transition-all duration-300 ease-in-out opacity-100 xl:opacity-0 xl:w-0 xl:-ml-1 xl:group-hover:opacity-100 xl:group-hover:w-4 xl:group-hover:ml-0"
      />
      <p
        class="text-sm font-medium mb-0 transition-all duration-300 ease-in-out xl:group-hover:translate-x-2"
      >
        {{ card.name }}
      </p>
    </div>
    <LayoutCardsMoveSelectedCardDialog
      :board-id="boardId"
      :card-id="card.id"
      :list-id="listId"
      class="absolute top-0 left-0 w-full h-full"
      @move="emit('move', $event)"
    >
      <template #trigger>
        <Icon
          name="ic:round-move-up"
          size="16"
          class="absolute top-[6px] right-[6px] cursor-pointer opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity"
        />
      </template>
    </LayoutCardsMoveSelectedCardDialog>
    <Icon
      @click="$emit('remove', card.id)"
      name="mdi:card-remove-outline"
      size="16"
      class="absolute bottom-[6px] right-[6px] cursor-pointer opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity"
    />
  </div>
</template>

<style scoped>
.group:hover {
  background-color: #f3f6f4cc;
  transition: background-color 0.2s ease;
}
</style>
