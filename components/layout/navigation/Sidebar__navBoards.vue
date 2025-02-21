<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";

const boardStore = useBoardsStore();
const boardList = computed(() => boardStore.boards);
</script>
<template>
  <UiCollapsible as-child :default-open="true" class="group/collapsible">
    <UiSidebarMenuItem class="relative inline-flex flex-col flex-grow">
      <UiCollapsibleTrigger>
        <UiSidebarMenuButton size="custom">
          <div
            class="flex items-center flex-grow gap-4 p-2 text-newwhite capitalize font-bold rounded-md duration-300 hover:text-[#1b9b4f] hover:opacity-70 hover:bg-newwhite"
          >
            <Icon name="solar:clipboard-list-broken" class="text-2xl" />
            <span>Boards</span>
            <Icon
              name="gg:chevron-up-o"
              class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
            />
          </div>
        </UiSidebarMenuButton>
      </UiCollapsibleTrigger>

      <UiCollapsibleContent>
        <UiSidebarMenuSub class="mx-6 px-0">
          <UiSidebarMenuSubItem
            v-for="board in boardList"
            :key="board.boardId"
            :id="board.boardId"
            class="flex justify-between items-center flex-grow gap-2 py-1 px-2 ml-2 text-newwhite capitalize font-bold rounded-md duration-300 hover:text-[#1b9b4f] hover:opacity-70 hover:bg-newwhite cursor-pointer"
          >
            <div
              class="w-8 h-6 rounded-lg"
              :style="{ 'background-image': board.gradient }"
            ></div>
            <div
              class="flex flex-row flex-nowrap justify-between flex-1 overflow-hidden"
            >
              <UiSidebarMenuSubButton as-child>
                <NuxtLink to="/" class="w-full">
                  <span>{{ board.boardName }}</span>
                </NuxtLink>
                <div class="flex flex-row flex-nowrap items-center gap-3">
                  <LayoutBoardsBoardDialog
                    mode="edit"
                    :board-id="board.boardId"
                  >
                    <template #trigger>
                      <Icon name="mdi:text-box-edit-outline" size="16" />
                    </template>
                  </LayoutBoardsBoardDialog>
                  <LayoutBoardsBoardCardRemoveDialog :board-id="board.boardId">
                    <template #alertTrigger
                      ><Icon name="wpf:full-trash" size="16" />
                    </template>
                  </LayoutBoardsBoardCardRemoveDialog>
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
              name="gg:add"
              size="20"
              class="text-newwhite hover:text-primary"
            />
          </template>
        </LayoutBoardsBoardDialog>
      </UiSidebarMenuAction>
    </UiSidebarMenuItem>
  </UiCollapsible>
</template>

<style scoped></style>
