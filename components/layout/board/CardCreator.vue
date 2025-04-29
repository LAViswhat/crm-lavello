<script setup lang="ts">
import { useListCardsStore } from "@/stores/listCards";

const props = defineProps<{
  boardId: string;
  listId?: string;
}>();

const cardName = ref("");
const popoverIsOpen = ref(false);
const listCardsStore = useListCardsStore();
const createCard = async () => {
  if (!cardName.value.trim() || !props.boardId || !props.listId) return;

  await listCardsStore.createCard(
    props.boardId,
    props.listId,
    cardName.value.trim()
  );
  cardName.value = "";
  popoverIsOpen.value = false;
};
</script>
<template>
  <div class="flex gap-4">
    <UiPopover v-model:open="popoverIsOpen">
      <UiPopoverTrigger>
        <UiButton size="sm">
          <Icon name="mynaui:plus" size="18" />
          <span class="text-sm">Add a new card</span>
        </UiButton>
      </UiPopoverTrigger>
      <UiPopoverContent>
        <div>
          <UiLabel for="name"></UiLabel>
          <UiInput
            id="name"
            type="text"
            placeholder="Enter the card name..."
            class="w-full mb-4"
            v-model="cardName"
            @keydown.enter="createCard"
          />
        </div>
        <div class="flex justify-around items-center">
          <Icon
            v-if="listCardsStore.loader"
            name="line-md:loading-alt-loop"
            size="36"
            class="text-secondary"
          />
          <UiButton v-else variant="default" @click="createCard">
            Add card
          </UiButton>
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

<style scoped></style>
