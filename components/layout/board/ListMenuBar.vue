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
  <UiMenubar class="bg-transparent">
    <UiMenubarMenu>
      <UiMenubarTrigger
        class="hover:bg-gray-400/30 data-[state=open]:bg-gray-400/50 p-1"
      >
        <Icon name="lineicons:menu-meatballs-1" size="22" />
      </UiMenubarTrigger>
      <UiMenubarContent
        side="bottom"
        class="bg-newwhite border-0 w-full flex flex-col"
      >
        <UiMenubarItem as-child>
          <UiPopover v-model:open="popoverIsOpen">
            <UiPopoverTrigger class="text-left pl-2">
              <span class="text-sm">Add a new card</span>
            </UiPopoverTrigger>
            <UiPopoverContent side="bottom">
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
                <UiButton variant="default" @click="createCard">
                  Add card
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
        </UiMenubarItem>
        <UiMenubarSeparator class="bg-0" />
        <UiMenubarItem as-child>
          <span>Edit board</span>
        </UiMenubarItem>
      </UiMenubarContent>
    </UiMenubarMenu>
  </UiMenubar>
</template>

<style scoped></style>
