<script setup lang="ts">
defineProps<{
  boardName: string | undefined;
  boardDescription: string | undefined;
  boardCreatedAt: Date | null;
}>();
</script>

<template>
  <UiSheet>
    <UiMenubar>
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
        <UiMenubarContent side="right" class="bg-gray-300/50 border-0">
          <UiSheetTrigger as-child>
            <UiMenubarItem>
              <div class="flex items-center gap-2">
                <Icon name="ix:about" size="20" class="text-newblack" />
                <span>About board</span>
              </div>
            </UiMenubarItem>
          </UiSheetTrigger>
          <UiMenubarSeparator class="bg-0" />
          <UiMenubarItem>
            <div class="flex items-center gap-2">
              <Icon
                name="mdi:text-box-edit-outline"
                size="20"
                class="text-newblack"
              />
              <span>Edit board</span>
            </div>
          </UiMenubarItem>
          <UiMenubarSeparator class="bg-0" />
          <UiMenubarItem
            ><div class="flex items-center gap-2">
              <Icon name="wpf:full-trash" size="20" class="text-newblack" />
              <span>Remove board</span>
            </div></UiMenubarItem
          >
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
