<script setup lang="ts">
import { useBoardsStore, type IBoard } from "@/stores/boards";
import { useBoardListsStore, type IBoardList } from "@/stores/boardLists";
import { Timestamp } from "firebase/firestore";

definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const boardStore = useBoardsStore();
const boardListsStore = useBoardListsStore();
const board = ref<IBoard | null>();
const listName = ref("");
const boardLists = ref<IBoardList[]>([]);
const popoverIsOpen = ref(false);
const editingListId = ref<string | null>(null);
const tempListName = ref("");

onMounted(async () => {
  await boardStore.getBoards();
  board.value = await boardStore.getBoard(route.params.id as string);
  if (!board.value) {
    await router.push("/dashboard");
  } else {
    await boardListsStore.getBoardLists(board.value.boardId);
    boardLists.value = boardListsStore.boardLists;
  }
});

watchEffect(async () => {
  if (board.value) {
    const updatedBoard = await boardStore.getBoard(board.value.boardId);
    if (updatedBoard) {
      board.value = updatedBoard;
    }
    await boardListsStore.getBoardLists(board.value.boardId);
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

const createList = async () => {
  if (!listName.value.trim() || !board.value?.boardId) return;

  await boardListsStore.createList(board.value.boardId, listName.value.trim());
  listName.value = "";
  popoverIsOpen.value = false;
};

const startEditing = (list: IBoardList) => {
  editingListId.value = list.listId;
  tempListName.value = list.listName;
};

const saveListName = async (listId: string) => {
  if (!board.value?.boardId || !tempListName.value.trim()) {
    editingListId.value = null;
    return;
  }
  await boardListsStore.updateListName(
    board.value.boardId,
    listId,
    tempListName.value.trim()
  );
  editingListId.value = null;
};

const cancelEditing = () => {
  editingListId.value = null;
  tempListName.value = "";
};

const handleKeydown = async (event: KeyboardEvent, listId: string) => {
  if (event.key === "Enter") {
    await saveListName(listId);
  } else if (event.key === "Escape") {
    cancelEditing();
  }
};

const onDragEnd = async () => {
  if (board.value?.boardId) {
    await boardListsStore.updateBoardListOrder(
      board.value.boardId,
      boardLists.value
    );
    boardLists.value = [...boardLists.value];
  }
};

const handleDraggableError = (error: any) => {
  console.error("Draggable error:", error);
};
</script>

<template>
  <LayoutLoader v-if="boardStore.loader" />
  <div
    v-else
    class="board-main-content flex flex-col min-h-full duration-300"
    :style="{ 'background-image': board?.gradient, opacity: board ? 1 : 0 }"
  >
    <div
      class="board-header h-16 flex flex-row justify-between items-center relative"
    >
      <LayoutBoardPageHeader
        :board-name="board?.boardName"
        :board-description="board?.boardDescription"
        :board-created-at="boardCreatedAt"
        :board-id="board?.boardId"
        class="bg-transparent"
      />
      <div class="absolute inset-0 bg-slate-500/50 z-10"></div>
    </div>
    <div class="board-canvas mt-8 px-8 flex-grow">
      <div class="flex gap-4">
        <UiPopover v-model:open="popoverIsOpen">
          <UiPopoverTrigger>
            <UiButton
              variant="outline"
              size="md"
              class="justify-start !min-w-64"
            >
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
              <UiButton variant="default" @click="createList">
                Add list
              </UiButton>
              <UiButton
                variant="ghost"
                size="icon"
                @click="popoverIsOpen = false"
              >
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
      <ClientOnly>
        <draggable
          tag="transition-group"
          :component-data="{
            attrs: {
              name: 'draggableList',
              class: 'draggableList mt-4 flex gap-4 flex-wrap',
            },
          }"
          item-key="listId"
          :list="boardLists"
          @change="onDragEnd"
          @end="onDragEnd"
          @error="handleDraggableError"
          :sort="true"
          :disabled="editingListId !== null"
          animation="300"
          ghost-class="ghost"
          drag-class="dragging"
          :touch="true"
          :fallback-on-body="true"
          :force-fallback="true"
        >
          <template #default>
            <UiCard
              v-for="list in boardLists"
              :key="list.listId"
              class="draggableCard"
            >
              <UiCardHeader>
                <div v-if="editingListId === list.listId">
                  <UiInput
                    v-model="tempListName"
                    type="text"
                    class="text-lg font-bold text-newblack w-full bg-transparent border-b border-primary focus:outline-none focus:border-primary"
                    @blur="saveListName(list.listId)"
                    @keydown="handleKeydown($event, list.listId)"
                    ref="inputRef"
                    autofocus
                  />
                </div>
                <UiCardTitle v-else @click="startEditing(list)">
                  {{ list.listName }}
                </UiCardTitle>
                <UiCardDescription>
                  Created: {{ list.createdAt.toLocaleDateString() }}
                </UiCardDescription>
              </UiCardHeader>
              <UiCardContent>
                <p>No items yet</p>
              </UiCardContent>
            </UiCard>
          </template>
        </draggable>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.dragging {
  transform: rotate(6deg) scale(1.05);
  opacity: 0.85;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  cursor: grabbing;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease,
    box-shadow 0.25s ease;
  z-index: 50;
  user-select: none;
}

.draggableCard {
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  user-select: none;
}

.ghost {
  opacity: 0.3;
  transform: scale(0.95);
  border: 2px dashed #cbd5e1;
  background-color: #f8fafc;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease,
    background-color 0.25s ease;
  user-select: none;
}

.draggableList-move {
  transition: transform 300ms ease;
}
.draggableList-enter-active,
.draggableList-leave-active {
  transition: all 0.3s ease;
}

.draggableList > * {
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.25s ease;
}

.v-move {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.draggableCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: grab;
}
</style>
