<script setup lang="ts">
const props = defineProps<{
  boardId: string | undefined;
  handleRemoveBoard: () => Promise<void>;
}>();
</script>

<template>
  <UiMenubarContent
    side="right"
    class="bg-newwhite border-0 w-full flex flex-col"
  >
    <UiSheetTrigger as-child>
      <UiMenubarItem>
        <div class="flex items-center gap-2">
          <Icon name="ix:about" size="20" class="text-newblack" />
          <span>About board</span>
        </div>
      </UiMenubarItem>
    </UiSheetTrigger>
    <UiMenubarSeparator class="bg-0" />
    <UiMenubarItem as-child>
      <LayoutBoardsBoardDialog mode="edit" :board-id="boardId">
        <template #trigger>
          <div
            class="flex items-center gap-2 w-full cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
          >
            <Icon
              name="mdi:text-box-edit-outline"
              size="20"
              class="text-newblack"
            />
            <span>Edit board</span>
          </div>
        </template>
      </LayoutBoardsBoardDialog>
    </UiMenubarItem>
    <UiMenubarSeparator class="bg-0" />
    <UiMenubarItem as-child>
      <LayoutRemoveDialog
        :board-id="boardId"
        :description="'This action cannot be undone. This will permanently delete this board and remove your data from our servers.'"
        :onRemove="handleRemoveBoard"
      >
        <template #alertTrigger>
          <div
            class="flex items-center gap-2 w-full cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
          >
            <Icon name="wpf:full-trash" size="20" class="text-newblack" />
            <span>Remove board</span>
          </div>
        </template>
      </LayoutRemoveDialog>
    </UiMenubarItem>
  </UiMenubarContent>
</template>
