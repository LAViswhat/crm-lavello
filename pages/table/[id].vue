<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { useFormatDate } from "@/composables/useFormatDate";

definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const boardStore = useBoardsStore();
const boardListsStore = useBoardListsStore();
const listCardsStore = useListCardsStore();
const board = ref<IBoard | null>();
const boardLists = ref<IBoardList[]>([]);
const { formatDate } = useFormatDate();

onMounted(async () => {
  await boardStore.getBoards();
  board.value = await boardStore.getBoard(route.params.id as string);
  if (!board.value) {
    await router.push("/dashboard");
  } else {
    await boardListsStore.getBoardLists(board.value.boardId);
    await listCardsStore.loadCardsForBoard(board.value.boardId);
    boardLists.value = boardListsStore.boardLists;
  }
});

const boardCreatedAt = computed(() => {
  if (board.value?.createdAt) {
    if (board.value.createdAt instanceof Timestamp) {
      return board.value.createdAt.toDate();
    }
    return board.value.createdAt as Date;
  }
  return null;
});

const boardEditedAt = computed(() => {
  if (board.value?.editedAt) {
    if (board.value.editedAt instanceof Timestamp) {
      return board.value.editedAt.toDate();
    }
    return board.value.editedAt as Date;
  }
  return null;
});

const badgeLabelDisplay = ref<boolean>(false);
const toggleBadgeLabel = () => {
  badgeLabelDisplay.value = !badgeLabelDisplay.value;
};

const sanitizedDescription = computed(() => {
  return (card: ICard) => {
    if (!card.info?.description) return "";

    // Простейшая очистка (не для продакшена!)
    return card.info.description
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+="[^"]*"/gi, "");
  };
});
</script>

<template>
  <LayoutLoader v-if="boardStore.loader" />
  <div
    v-else
    class="flex flex-col min-h-full duration-300"
    :style="{ 'background-image': board?.gradient, opacity: board ? 1 : 0 }"
  >
    <div
      class="board-header h-16 flex flex-row justify-between items-center relative"
    >
      <LayoutBoardPageHeader
        :board-name="board?.boardName"
        :board-description="board?.boardDescription"
        :board-created-at="boardCreatedAt"
        :board-edited-at="boardEditedAt"
        :board-id="board?.boardId"
        class="bg-transparent"
      />
      <div class="absolute inset-0 bg-slate-500/50 z-10"></div>
    </div>
    <div v-if="boardLists.length" class="mt-8 px-8">
      <div v-for="list in boardLists" :key="list.listId">
        <div class="px-2 py-4 rounded-t-md bg-newblack">
          <h3 class="inline-flex items-center gap-1 text-newwhite">
            <Icon name="fluent:list-bar-16-regular" /> {{ list.listName }}
          </h3>
          <div class="flex items-center text-secondary pt-2">
            <Icon name="hugeicons:property-edit" class="mr-2 h-6 w-6" />
            <span class="text-xs">
              Last update: {{ formatDate(boardEditedAt) }}
            </span>
          </div>
          <div class="flex items-center text-newwhite/70 pt-2">
            <Icon name="solar:calendar-broken" class="mr-2 h-6 w-6" />
            <span class="text-xs">
              Created: {{ formatDate(boardCreatedAt) }}
            </span>
          </div>
        </div>
        <UiTable class="mb-8 rounded">
          <UiTableHeader class="bg-newwhite border">
            <UiTableRow>
              <UiTableHead class="text-center">Card name</UiTableHead>
              <UiTableHead class="text-center">Description</UiTableHead>
              <UiTableHead class="text-center">Date created</UiTableHead>
              <UiTableHead class="text-center">Badges</UiTableHead>
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody class="border">
            <UiTableRow
              v-for="card in listCardsStore.getCardsForList(list.listId).value"
              :key="card.id"
            >
              <UiTableCell class="text-center max-w-10">{{
                card.name
              }}</UiTableCell>
              <UiTableCell
                v-if="card.info?.description"
                v-html="sanitizedDescription(card)"
                class="text-center"
              ></UiTableCell>
              <UiTableCell v-else class="text-center">
                <Icon name="pepicons-pop:line-x"
              /></UiTableCell>

              <UiTableCell class="text-center max-w-10">{{
                formatDate(card.createdAt)
              }}</UiTableCell>
              <UiTableCell class="text-center max-w-16">
                <div
                  v-if="card.info?.badges"
                  class="flex flex-wrap justify-center items-center gap-1"
                >
                  <template v-for="(badge, idx) in card.info.badges"
                    ><span
                      @click="toggleBadgeLabel"
                      v-if="card.info.badgesChecked?.[idx]"
                      :key="idx"
                      class="inline-flex items-center text-center px-2 py-1 rounded text-xs cursor-pointer hover:opacity-70 transition-all duration-300 overflow-hidden"
                      :style="{
                        background: badge.background,
                        width: badgeLabelDisplay ? 'auto' : '2.5rem',
                        minWidth: badgeLabelDisplay ? '2.5rem' : '2.5rem',
                        height: badgeLabelDisplay ? '1.25rem' : '0.5rem',
                      }"
                    >
                      <span
                        class="badge-label px-2 py-0.5 whitespace-nowrap transition-all duration-300"
                        :style="{
                          opacity: badgeLabelDisplay ? 1 : 0,
                          transform: badgeLabelDisplay
                            ? 'translateX(0)'
                            : 'translateX(-10px)',
                        }"
                      >
                        {{ badge.label }}
                      </span>
                    </span></template
                  >
                </div>
                <div v-else class="text-center">
                  <Icon name="pepicons-pop:line-x" />
                </div>
              </UiTableCell>
            </UiTableRow>
          </UiTableBody>
        </UiTable>
      </div>
    </div>
    <div
      v-else
      class="text-center text-newwhite bg-slate-500/50 z-40 border-t py-2"
    >
      <h4>There are no tables to show</h4>
    </div>
  </div>
</template>

<style scoped></style>
