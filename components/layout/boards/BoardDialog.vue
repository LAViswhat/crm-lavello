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

const boardStore = useBoardsStore();
const nameField = ref("");

const disabledCreateBtn = computed<boolean>(() => {
  return !nameField.value;
});

const onSubmit = form.handleSubmit((values) => {
  boardStore.createBoard(values.name, values.description);
});
</script>
<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <UiButton
        variant="outline"
        size="md"
        class="min-h-40 min-w-60 border-0 shadow-xl focus-visible:ring-offset-0 focus-visible:ring-transparent"
      >
        <Icon
          name="line-md:plus-circle-filled"
          size="36"
          class="text-primary"
        />
        <span>Create new board</span>
      </UiButton>
    </UiDialogTrigger>
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle class="normal-case text-newblack"
          >Create new board</UiDialogTitle
        >
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
                ></Textarea>
              </UiFormControl>
            </div>
            <UiFormMessage class="ml-8 !mt-1" />
          </UiFormItem>
        </UiFormField>
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
          Create
        </UiButton>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped></style>
