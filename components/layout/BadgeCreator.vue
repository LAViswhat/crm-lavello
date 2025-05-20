<script setup lang="ts">
const props = defineProps<{
  boardId: string;
  cardId: string;
}>();

const listCardsStore = useListCardsStore();
const card = computed(() => listCardsStore.allCards.get(props.cardId));
const isEditing = ref(false);

const badgeInputs = ref(["", "", "", ""]);
const badgeColors = ref(["#84cc16", "#fcd34d", "#38bdf8", "#f43f5e"]);
const checked = ref([false, false, false, false]);

const updateFromCard = () => {
  if (!card.value) return;

  if (card.value.info?.badges) {
    card.value.info?.badges.forEach((badge: any, idx: number) => {
      if (idx < 4) {
        badgeInputs.value[idx] = badge.label || "";
        badgeColors.value[idx] = badge.background || "#84cc16";
      }
    });
  }

  if (card.value.info?.badgesChecked) {
    card.value.info?.badgesChecked.forEach((value: boolean, idx: number) => {
      if (idx < 4) {
        checked.value[idx] = value;
      }
    });
  }
};

onMounted(updateFromCard);

function onInputChange(idx: number, val: string) {
  isEditing.value = true;
  badgeInputs.value[idx] = val;
}

function onCheckboxChange(idx: number, val: boolean) {
  isEditing.value = true;
  checked.value[idx] = val;
}

async function saveBadges() {
  if (!card.value) return;
  isEditing.value = false;

  const badges = badgeInputs.value.map((label, idx) => ({
    label,
    background: badgeColors.value[idx],
  }));

  await listCardsStore.updateCard(props.boardId, props.cardId, {
    info: {
      ...(card.value.info || {}),
      badges,
      badgesChecked: [...checked.value],
    },
  });
}

// Следим за изменением карточки
watch(
  () => card.value,
  (newCard) => {
    if (isEditing.value) return; // Не обновлять, если пользователь редактирует
    updateFromCard();
  }
);
</script>
<template>
  <UiCollapsible class="min-w-[230px] text-right">
    <UiCollapsibleTrigger class="cursor-pointer">
      <span class="flex items-center gap-2 px-2 py-1.5 text-sm"
        ><Icon name="iconamoon:badge" size="20" />Badges</span
      >
    </UiCollapsibleTrigger>
    <UiCollapsibleContent side="bottom">
      <div class="badges flex flex-col gap-2 mb-2 pt-2">
        <div
          v-for="(label, idx) in badgeInputs"
          :key="idx"
          class="badge flex items-center gap-2 px-2"
        >
          <UiCheckbox
            :id="`badge-check-${idx}`"
            v-model="checked[idx]"
            @update:model-value="
              (val) => {
                if (val === true || val === false) onCheckboxChange(idx, val);
              }
            "
          />
          <UiInput
            :id="`badge-${idx}`"
            type="text"
            :placeholder="`Badge name...`"
            :model-value="badgeInputs[idx]"
            @update:model-value="(val) => onInputChange(idx, String(val))"
            class="flex-1 placeholder:text-newblack/40 text-newblack"
            :style="{ background: badgeColors[idx] }"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <UiCollapsibleTrigger class="flex items-center gap-4">
          <UiButton variant="default" @click="saveBadges">Save</UiButton>
          <UiButton variant="ghost" size="icon">
            <Icon
              name="charm:cross"
              size="32"
              class="text-primary hover:text-secondary"
            />
          </UiButton>
        </UiCollapsibleTrigger>
      </div>
    </UiCollapsibleContent>
  </UiCollapsible>
</template>

<style scoped></style>
