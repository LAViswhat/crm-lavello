<script setup lang="ts">
import { useBoardListsStore, type IBoardList } from "@/stores/boardLists";

const props = defineProps<{
  boardId?: string;
  lists: IBoardList[];
}>();

const boardListsStore = useBoardListsStore();
const editingListId = ref<string | null>(null);
const tempListName = ref("");

const startEditing = (list: IBoardList) => {
  editingListId.value = list.listId;
  tempListName.value = list.listName;
};

const saveListName = async (listId: string) => {
  if (!props.boardId || !tempListName.value.trim()) {
    editingListId.value = null;
    return;
  }
  await boardListsStore.updateListName(
    props.boardId,
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
  if (props.boardId) {
    await boardListsStore.updateBoardListOrder(props.boardId, props.lists);
  }
};

const handleDraggableError = (error: any) => {
  console.error("Draggable error:", error);
};
</script>
<template>
  <draggable
    tag="transition-group"
    :component-data="{
      attrs: {
        name: 'draggableList',
        class: 'draggableList mt-4 flex gap-4 flex-wrap',
      },
    }"
    item-key="listId"
    :list="lists"
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
      <LayoutBoardPageList
        v-for="list in lists"
        :key="list.listId"
        :list="list"
        :is-editing="editingListId === list.listId"
        :temp-list-name="tempListName"
        :board-id="boardId"
        @start-editing="startEditing"
        @save-list-name="saveListName"
        @cancel-editing="cancelEditing"
        @keydown="handleKeydown"
        @update:tempListName="tempListName = $event"
      />
    </template>
  </draggable>
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
</style>
