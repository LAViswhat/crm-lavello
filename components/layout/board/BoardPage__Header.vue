<script setup lang="ts">
const props = defineProps<{
  boardName: string | undefined;
  boardDescription: string | undefined;
  boardCreatedAt: Date | null;
  boardId: string | undefined;
}>();
</script>

<template>
  <UiSheet>
    <UiMenubar class="bg-transparent">
      <UiMenubarMenu>
        <UiMenubarTrigger
          class="hover:bg-gray-300/30 data-[state=open]:bg-gray-300/50"
        >
          <div
            class="flex flex-row items-center text-newwhite z-20 duration-200"
          >
            <h2 class="normal-case mb-0 text-lg sm:text-2xl">
              {{ boardName }}
            </h2>
            <Icon name="iwwa:option" size="28" />
          </div>
        </UiMenubarTrigger>
        <UiMenubarContent
          side="right"
          class="bg-gray-300/50 border-0 w-full flex flex-col"
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
            <LayoutBoardsBoardCardRemoveDialog :board-id="boardId">
              <template #alertTrigger
                ><div
                  class="flex items-center gap-2 w-full cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                >
                  <Icon name="wpf:full-trash" size="20" class="text-newblack" />
                  <span>Remove board</span>
                </div>
              </template>
            </LayoutBoardsBoardCardRemoveDialog>
          </UiMenubarItem>
        </UiMenubarContent>
      </UiMenubarMenu>
    </UiMenubar>
    <LayoutBoardPageHeaderAboutContent
      :board-name="boardName"
      :board-description="boardDescription"
      :board-created-at="boardCreatedAt"
    ></LayoutBoardPageHeaderAboutContent>
  </UiSheet>
</template>

<style scoped></style>
