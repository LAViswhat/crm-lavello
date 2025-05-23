<script setup lang="ts">
import { useBoardsStore } from "@/stores/boards";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import Textarea from "~/components/ui/textarea/Textarea.vue";

import { BOARD_CREATION_FORM_DATA } from "./boardDialog.data";

const formSchema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, { message: "Field is required" }),
    description: z.string().optional(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const props = defineProps<{
  mode: "create" | "edit";
  boardId?: string;
}>();

const boardStore = useBoardsStore();
const nameField = ref("");
const descriptionField = ref("");
const selectedGradient = ref("");

onMounted(async () => {
  if (props.mode === "edit" && props.boardId) {
    const boardData = await boardStore.getBoard(props.boardId);
    if (boardData) {
      nameField.value = boardData.boardName;
      descriptionField.value = boardData.boardDescription || "";
      selectedGradient.value = boardData.gradient || "";

      form.setValues({
        name: boardData.boardName,
        description: boardData.boardDescription,
      });
    }
  } else {
    // Сброс полей при создании новой доски
    nameField.value = "";
    descriptionField.value = "";
    selectedGradient.value = "";
    form.resetForm();
  }
});

const disabledCreateBtn = computed<boolean>(() => {
  return !nameField.value;
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const onSubmit = form.handleSubmit(async (values) => {
  try {
    if (props.mode === "edit" && props.boardId) {
      await boardStore.updateBoard(
        props.boardId,
        values.name,
        values.description,
        selectedGradient.value
      );
    } else {
      await boardStore.createBoard(
        values.name,
        values.description,
        selectedGradient.value
      );
    }
    emit("close");
  } catch (error) {
    console.error("Error saving board:", error);
  }
});
</script>
<template>
  <UiDialogContent class="sm:max-w-[425px]">
    <UiDialogHeader>
      <UiDialogTitle class="normal-case text-newblack">{{
        props.mode === "create" ? "Create new board" : "Edit board"
      }}</UiDialogTitle>
    </UiDialogHeader>
    <form
      @submit="onSubmit"
      class="flex flex-col items-center justify-center gap-4 px-4"
    >
      <UiFormField
        v-for="item in BOARD_CREATION_FORM_DATA"
        :key="item.name"
        v-slot="{ componentField }"
        :name="item.name"
      >
        <UiFormItem v-auto-animate class="w-full">
          <div class="inline-flex items-center gap-2 w-full">
            <UiFormLabel>
              <Icon :name="item.icon" size="24" />
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-if="item.type === 'text'"
                :type="item.type"
                :placeholder="item.placeholder"
                v-bind="componentField"
                v-model="nameField"
              />
              <Textarea
                v-else
                :placeholder="item.placeholder"
                v-bind="componentField"
                v-model="descriptionField"
              ></Textarea>
            </UiFormControl>
          </div>
          <UiFormMessage class="ml-8 !mt-1" />
        </UiFormItem>
      </UiFormField>
      <LayoutGradientPicker
        v-model:selectedGradient="selectedGradient"
        @select-gradient="selectedGradient = $event"
      />
      <Icon
        v-if="boardStore.loader"
        name="line-md:loading-alt-loop"
        size="36"
        class="text-secondary"
      />
      <UiButton
        v-else
        :variant="disabledCreateBtn ? 'disabled' : 'default'"
        type="submit"
      >
        {{ props.mode === "create" ? "Create" : "Save changes" }}
      </UiButton>
    </form>
  </UiDialogContent>
</template>

<style scoped></style>
