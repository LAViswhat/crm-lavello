<script setup lang="ts">
import { useBoardListsStore } from "@/stores/boardLists";

const props = defineProps<{
  boardId?: string;
}>();

const listName = ref("");
const popoverIsOpen = ref(false);
const boardListsStore = useBoardListsStore();

const createList = async () => {
  if (!listName.value.trim() || !props.boardId) return;

  await boardListsStore.createList(props.boardId, listName.value.trim());
  listName.value = "";
  popoverIsOpen.value = false;
};
</script>
<template>
  <div class="flex gap-4">
    <UiPopover v-model:open="popoverIsOpen">
      <UiPopoverTrigger>
        <UiButton variant="outline" size="md" class="justify-start !min-w-64">
          <Icon name="mynaui:plus" size="24" class="" />
          <span class="text-lg">Add a new list</span>
        </UiButton>
      </UiPopoverTrigger>
      <UiPopoverContent>
        <div>
          <UiLabel for="name"></UiLabel>
          <UiInput
            id="name"
            type="text"
            placeholder="Enter the list name..."
            class="w-full mb-4"
            v-model="listName"
            @keydown.enter="createList"
          />
        </div>
        <div class="flex justify-around items-center">
          <UiButton variant="default" @click="createList"> Add list </UiButton>
          <UiButton variant="ghost" size="icon" @click="popoverIsOpen = false">
            <Icon
              name="charm:cross"
              size="32"
              class="text-primary hover:text-secondary"
            />
          </UiButton>
        </div>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>

<style lang="scss" scoped></style>
