<script setup lang="ts">
import { useFormatDate } from "@/composables/useFormatDate";
const props = defineProps<{
  boardId: string;
  cardId: string;
}>();

const boardListsStore = useBoardListsStore();
const listCardsStore = useListCardsStore();

const card = computed(() => listCardsStore.allCards.get(props.cardId));

const listName = computed(() => {
  const list = boardListsStore.boardLists.find(
    (list) => list.listId === card.value?.listId
  );
  return list?.listName || "";
});

const isEditingTittle = ref(false);
const isEditingDescription = ref(false);
const title = ref(card.value?.name || "");
const description = ref(card.value?.info?.description || "");

const { formatDate } = useFormatDate();

// Сохранение изменений
const saveChanges = async () => {
  if (!card.value) return;

  const newTitle = title.value.trim();
  const newDescription = description.value.trim();
  const oldTitle = card.value.name.trim();
  const oldDescription = (card.value.info?.description || "").trim();

  // Если ничего не изменилось — не обновляем
  if (newTitle === oldTitle && newDescription === oldDescription) return;

  try {
    await listCardsStore.updateCard(props.boardId, props.cardId, {
      name: newTitle,
      info: { ...(card.value.info || {}), description: newDescription },
    });
  } catch (error) {
    console.error("Error saving card changes:", error);
  }
};
</script>

<template>
  <UiDialog>
    <UiDialogTrigger class="w-full pr-4">
      <slot name="editorTrigger"></slot>
    </UiDialogTrigger>
    <UiDialogContent class="xl:max-w-xl">
      <UiDialogHeader>
        <!-- Заголовок карточки -->
        <UiDialogTitle>
          <div
            @click="isEditingTittle = true"
            v-if="!isEditingTittle"
            class="pt-2 flex justify-left items-center gap-2"
          >
            <Icon
              name="mdi:pencil"
              size="20"
              class="cursor-pointer text-newblack"
            />
            <h2 class="cursor-pointer mb-0 normal-case text-newblack">
              {{ title }}
            </h2>
          </div>

          <UiInput
            v-else
            v-model="title"
            class="mt-4 text-2xl border-2 border-primary w-full"
            placeholder="Enter card title"
            @blur="
              isEditingTittle = false;
              saveChanges();
            "
            @keydown.enter="
              isEditingTittle = false;
              saveChanges();
            "
          />
          <UiDialogDescription
            class="flex items-center gap-1 text-left text-xs pl-3 mt-2"
          >
            <span class="uppercase text-gray-600">In list:</span>
            <span class="normal-case">{{ listName }}</span>
          </UiDialogDescription>

          <UiDialogDescription
            v-if="card?.info?.badges"
            class="flex items-center pl-3 mt-2"
          >
            <span class="uppercase text-xs text-gray-600 pr-1">Badges:</span>
            <div class="flex flex-wrap gap-2">
              <template
                v-for="(badge, idx) in card?.info?.badges ?? []"
                :key="idx"
              >
                <span
                  v-if="card?.info?.badgesChecked?.[idx]"
                  class="relative inline-flex items-center min-w-16 px-2 py-0.5 pr-4 rounded normal-case text-sm font-medium text-newblack"
                  :style="{ background: badge.background }"
                >
                  {{ badge.label }}
                  <Icon
                    name="charm:cross"
                    size="16"
                    class="absolute inset-y-auto right-0 cursor-pointer"
                    @click.stop="
                      async () => {
                        const updated = [...(card?.info?.badgesChecked ?? [])];
                        updated[idx] = false;
                        await listCardsStore.updateCard(
                          props.boardId,
                          props.cardId,
                          {
                            info: {
                              ...(card?.info || {}),
                              badgesChecked: updated,
                            },
                          }
                        );
                      }
                    "
                  />
                </span>
              </template>
            </div>
          </UiDialogDescription>
        </UiDialogTitle>
      </UiDialogHeader>

      <!-- Описание карточки -->
      <div class="mt-4">
        <div class="flex justify-between items-center pb-2">
          <span class="flex items-center gap-2 text-md text-primary">
            <Icon
              name="fluent:text-description-20-filled"
              size="20"
              class="text-primary"
            />Description</span
          >
          <UiButton
            v-if="card?.info?.description && !isEditingDescription"
            variant="outline"
            size="sm"
            @click="isEditingDescription = true"
            >Change</UiButton
          >
        </div>
        <LayoutCardsCardDescriptionEditor
          v-model="description"
          :editable="true"
          :is-editing="isEditingDescription"
          @save="
            (val) => {
              description = val;
              saveChanges();
              isEditingDescription = false;
            }
          "
          @cancel="
            description = card?.info?.description || '';
            isEditingDescription = false;
          "
        />
      </div>

      <UiDialogFooter class="relative !justify-end mt-4 text-xs text-gray-600">
        <p class="absolute top-[10px] left-0 mb-0">
          Created: {{ formatDate(card?.createdAt ?? null) }}
        </p>
        <LayoutBadgeCreator :board-id="boardId" :card-id="cardId" />
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped></style>
