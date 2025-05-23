<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";

const boardStore = useBoardsStore();
const boardList = computed(() => boardStore.boards);
const route = useRoute();

const handleClick = () => {
  const sidebar = document.querySelector('[data-sidebar="sidebar"]');
  if (sidebar) {
    sidebar.closest(".group")?.setAttribute("data-collapsible", "");
  }
};
const currentBoardId = computed(() => {
  // Проверяем разные возможные форматы URL
  if (route.params.boardId) return route.params.boardId as string;
  if (route.path.startsWith("/board/")) {
    const parts = route.path.split("/");
    return parts[2]; // Возвращаем ID из /board/{id}
  }
  return undefined;
});

const handleRemoveBoard = async () => {
  if (currentBoardId.value) {
    await boardStore.removeBoard(currentBoardId.value);
  }
};
</script>
<template>
  <UiCollapsible as-child :default-open="true" class="group/collapsible">
    <UiSidebarMenuItem class="relative inline-flex flex-col flex-grow">
      <UiCollapsibleTrigger>
        <UiSidebarMenuButton size="custom" @click="handleClick">
          <div
            class="flex items-center flex-grow gap-4 p-2 text-newwhite capitalize font-bold rounded-md duration-300 hover:text-[#1b9b4f] hover:opacity-70 hover:bg-newwhite"
          >
            <Icon name="fa-solid:list-alt" class="text-2xl" />
            <span>Boards</span>
            <Icon
              v-if="boardList.length"
              name="gg:chevron-up-o"
              class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
            />
          </div>
        </UiSidebarMenuButton>
      </UiCollapsibleTrigger>

      <UiCollapsibleContent v-if="boardList.length">
        <UiSidebarMenuSub class="mx-6 px-0">
          <UiSidebarMenuSubItem
            v-for="board in boardList"
            :key="board.boardId"
            :id="board.boardId"
            :class="[
              'flex justify-between items-center flex-grow gap-2 py-1 px-2 ml-2 capitalize font-bold rounded-md duration-300 hover:opacity-70 hover:bg-newwhite cursor-pointer',
              currentBoardId === board.boardId
                ? 'bg-newwhite/90 text-primary'
                : 'text-newwhite hover:text-[#1b9b4f]',
            ]"
          >
            <div
              class="w-8 h-6 rounded-lg"
              :style="{ 'background-image': board.gradient }"
            ></div>
            <div
              class="flex flex-row flex-nowrap justify-between items-center flex-1 overflow-hidden"
            >
              <UiSidebarMenuSubButton as-child>
                <NuxtLink :to="`/board/${board.boardId}`" class="w-full">
                  <span>{{ board.boardName }}</span>
                </NuxtLink>
                <div
                  class="flex flex-row flex-nowrap justify-center items-center gap-3 pt-1"
                >
                  <LayoutBoardsBoardDialog
                    class="pt-0.5"
                    mode="edit"
                    :board-id="board.boardId"
                  >
                    <template #trigger>
                      <Icon name="mdi:text-box-edit-outline" size="16" />
                    </template>
                  </LayoutBoardsBoardDialog>
                  <LayoutRemoveDialog
                    :board-id="board.boardId"
                    :description="'This action cannot be undone. This will permanently delete this board and remove your data from our servers.'"
                    :onRemove="handleRemoveBoard"
                  >
                    <template #alertTrigger
                      ><Icon name="wpf:full-trash" size="16" />
                    </template>
                  </LayoutRemoveDialog>
                </div>
              </UiSidebarMenuSubButton>
            </div>
          </UiSidebarMenuSubItem>
        </UiSidebarMenuSub>
      </UiCollapsibleContent>
      <UiSidebarMenuAction
        show-on-hover
        class="top-[0.8rem] focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <LayoutBoardsBoardDialog mode="create">
          <template #trigger>
            <Icon
              name="si:add-fill"
              size="24"
              class="text-newwhite hover:text-primary"
            />
          </template>
        </LayoutBoardsBoardDialog>
      </UiSidebarMenuAction>
    </UiSidebarMenuItem>
  </UiCollapsible>
</template>

<style scoped></style>
