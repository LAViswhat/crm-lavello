<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

import { REGISTER_FORM_DATA } from "./register.data";

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, { message: "Field is required" })
      .email("Must be a valid email"),
    password: z
      .string()
      .min(1, { message: "This is required" })
      .min(8, { message: "Too short" }),
    username: z.string(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((values) => {
  console.log("Form submitted!", values);
});
</script>
<template>
  <div
    class="flex justify-center items-center min-h-screen w-full bg-[url('/reg_bg.jpg')] bg-no-repeat bg-cover relative"
  >
    <div
      class="absolute top-0 left-0 bottom-0 right-0 bg-lime-800 opacity-30 z-0"
    ></div>
    <div
      class="rounded-md bg-newwhite shadow-md border-secondary w-1/4 p-2 z-10 relative"
    >
      <header
        class="bg-primary rounded-md flex justify-center items-center w-3/4 absolute -top-3 left-2/4 -translate-x-2/4 -translate-y-2/4"
      >
        <h2 class="text-newwhite capitalize pt-2">Register</h2>
      </header>
      <form
        @submit="onSubmit"
        class="mt-4 flex flex-col items-center justify-center gap-4 px-4"
      >
        <UiFormField
          v-for="item in REGISTER_FORM_DATA"
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
                  class="border-0 border-b-2 bg-transparent w-full focus-visible:ring-0 focus-visible:border-b-primary"
                  :type="item.type"
                  :placeholder="item.placeholder"
                  v-bind="componentField"
                />
              </UiFormControl>
            </div>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiButton class="mbtn" type="submit"> Get started </UiButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* .mbtn {
  position: relative;
}
.mbtn:hover {
  transform: translateY(-0.25em);
}
.mbtn::before {
  width: 100%;
  height: 1em;
  position: absolute;
  left: 0;
  bottom: -0.85em;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(0, 0, 0, 0) 80%
  );
  opacity: 0;
  transition: all 0.3s;
  content: "";
}
.mbtn:hover::before {
  opacity: 1;
} */
</style>
