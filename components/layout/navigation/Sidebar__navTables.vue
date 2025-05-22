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
  if (route.path.startsWith("/table/")) {
    const parts = route.path.split("/");
    return parts[2]; // Возвращаем ID из /board/{id}
  }
  return undefined;
});
</script>
<template>
  <UiCollapsible as-child :default-open="true" class="group/collapsible">
    <UiSidebarMenuItem class="relative inline-flex flex-col flex-grow">
      <UiCollapsibleTrigger>
        <UiSidebarMenuButton size="custom" @click="handleClick">
          <div
            class="flex items-center flex-grow gap-4 p-2 text-newwhite capitalize font-bold rounded-md duration-300 hover:text-[#1b9b4f] hover:opacity-70 hover:bg-newwhite"
          >
            <Icon name="bi:table" class="text-2xl" />
            <span>Tables</span>
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
              class="flex flex-row flex-nowrap justify-between items-center flex-1 overflow-hidden"
            >
              <UiSidebarMenuSubButton as-child>
                <NuxtLink :to="`/table/${board.boardId}`" class="w-full">
                  <span>{{ board.boardName }}</span>
                </NuxtLink>
              </UiSidebarMenuSubButton>
            </div>
          </UiSidebarMenuSubItem>
        </UiSidebarMenuSub>
      </UiCollapsibleContent>
    </UiSidebarMenuItem>
  </UiCollapsible>
</template>

<style scoped></style>
