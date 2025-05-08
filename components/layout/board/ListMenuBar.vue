<script setup lang="ts">
defineProps<{
  boardId: string;
  listId?: string;
}>();
</script>

<template>
  <UiMenubar class="bg-transparent">
    <UiMenubarMenu>
      <UiMenubarTrigger
        class="hover:bg-gray-400/30 data-[state=open]:bg-gray-400/50 p-1"
      >
        <Icon name="lineicons:menu-meatballs-1" size="22" />
      </UiMenubarTrigger>
      <UiMenubarContent
        side="bottom"
        class="bg-newwhite border-0 w-full flex flex-col py-4 cursor-pointer"
      >
        <UiMenubarItem as-child>
          <LayoutCardCreator :board-id="boardId" :list-id="listId">
            <span class="text-sm pl-2">Add a new card</span>
          </LayoutCardCreator>
        </UiMenubarItem>
        <UiMenubarSeparator class="bg-0" />
        <UiMenubarItem as-child>
          <span>Переместить список</span>
        </UiMenubarItem>
      </UiMenubarContent>
    </UiMenubarMenu>
  </UiMenubar>
</template>

<style scoped></style>
