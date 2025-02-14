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
    <UiAlertDialog>
      <UiMenubar
        class="absolute top-0 right-0 -translate-x-1 translate-y-4 bg-transparent border-none cursor-pointer h-0 p-0"
      >
        <UiMenubarMenu>
          <UiMenubarTrigger
            class="p-1 rounded-full hover:opacity-50 data-[state=open]:opacity-50"
          >
            <Icon name="lucide:settings" size="18" class="text-gray-500" />
          </UiMenubarTrigger>
          <UiMenubarContent class="bg-newwhite">
            <UiMenubarItem class="flex items-center gap-2 focus:bg-slate-200">
              <Icon
                name="mdi:text-box-edit-outline"
                size="18"
                class="text-newblack"
              />
              <span>Edit board</span>
            </UiMenubarItem>
            <UiMenubarSeparator />

            <UiAlertDialogTrigger class="w-full">
              <UiMenubarItem class="flex items-center gap-2 focus:bg-slate-200">
                <Icon name="wpf:full-trash" size="18" class="text-newblack" />
                <span>Remove board</span>
              </UiMenubarItem>
            </UiAlertDialogTrigger>
          </UiMenubarContent>
        </UiMenubarMenu>
      </UiMenubar>
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle class="normal-case"
            >Are you absolutely sure?</UiAlertDialogTitle
          >
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
