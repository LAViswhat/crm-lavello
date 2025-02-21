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
const boardData = ref<{
  boardName: string;
  boardDescription?: string;
  gradient?: string;
} | null>(null);
const nameField = ref(boardData.value?.boardName || "");
const descriptionField = ref(boardData.value?.boardDescription || "");
const selectedGradient = ref(boardData.value?.gradient || "");

onMounted(async () => {
  if (props.mode === "edit" && props.boardId) {
    boardData.value = await boardStore.getBoard(props.boardId);

    if (boardData.value) {
      nameField.value = boardData.value.boardName;
      descriptionField.value = boardData.value.boardDescription || "";
      selectedGradient.value = boardData.value.gradient || "";

      form.setValues({
        name: boardData.value.boardName,
        description: boardData.value.boardDescription,
      });
    }
  }
});

const disabledCreateBtn = computed<boolean>(() => {
  return !nameField.value;
});

const onSubmit = form.handleSubmit(async (values) => {
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
