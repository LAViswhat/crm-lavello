<script setup lang="ts">
const props = defineProps<{
  boardName: string | undefined;
  boardDescription: string | undefined;
  boardCreatedAt: Date | null;
  boardEditedAt: Date | null;
  boardId: string | undefined;
}>();

const boardStore = useBoardsStore();

const handleRemoveBoard = async () => {
  if (props.boardId) {
    await boardStore.removeBoard(props.boardId);
  }
};
</script>

<template>
  <UiSheet>
    <UiMenubar class="bg-transparent">
      <UiMenubarMenu>
        <UiMenubarTrigger
          class="hover:bg-gray-300/30 data-[state=open]:bg-gray-300/50"
        >
          <div
            class="flex flex-row items-center text-newwhite z-20 duration-200"
          >
            <h2 class="normal-case mb-0 text-base sm:text-2xl">
              {{ boardName }}
            </h2>
            <Icon name="cil:options" size="20" />
          </div>
        </UiMenubarTrigger>
        <LayoutBoardPageHeaderMenuContent
          :board-id="boardId"
          :handle-remove-board="handleRemoveBoard"
        />
      </UiMenubarMenu>
    </UiMenubar>
    <LayoutBoardPageHeaderAboutContent
      :board-name="boardName"
      :board-description="boardDescription"
      :board-created-at="boardCreatedAt"
      :board-edited-at="boardEditedAt"
    />
  </UiSheet>
</template>

<style scoped></style>
