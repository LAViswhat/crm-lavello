<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
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
      .min(6, { message: "Too short" }),
    username: z.string().optional(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const authStore = useAuthStore();

const onSubmit = form.handleSubmit(async (values) => {
  const username = values.username || "";
  await authStore.signUp(values.email, values.password, username);
});
</script>
<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen bg-[url('/reg_bg.jpg')] bg-no-repeat bg-cover relative"
  >
    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="-translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="translate-y-0"
      leave-to-class="-translate-y-full"
    >
      <UiAlert
        v-if="authStore.errorMessage"
        variant="destructive"
        class="fixed top-2 left-0 right-0 mx-auto w-1/4 mb-12 bg-secondary border-l-8 z-50 shadow-lg"
      >
        <div class="inline-flex gap-1 items-center">
          <Icon name="line-md:alert-loop" size="18" />
          <UiAlertTitle class="text-xl mb-0">{{
            authStore.errorMessage
          }}</UiAlertTitle>
        </div>
      </UiAlert>
    </Transition>
    <div
      class="absolute top-0 left-0 bottom-0 right-0 bg-lime-800 opacity-30 z-0"
    ></div>
    <div
      class="rounded-md bg-newwhite shadow-md border-newblack w-5/6 md:w-2/4 px-2 py-4 z-10 relative"
    >
      <header
        class="bg-primary rounded-md flex flex-col justify-center items-center w-3/4 absolute top-3 left-2/4 -translate-x-2/4 -translate-y-2/4"
      >
        <h2 class="text-newwhite capitalize p-2">Register</h2>
        <UiButton
          variant="ghost"
          @click="authStore.signInWithGoogle"
          class="hover:text-secondary"
        >
          <Icon name="fontisto:google-plus" size="20" />
        </UiButton>
        <p class="text-xs text-newwhite italic">or be classical</p>
      </header>
      <form
        @submit="onSubmit"
        class="mt-16 flex flex-col items-center justify-center gap-4 px-4"
      >
        <div class="text-left text-newblack w-full flex flex-wrap items-center">
          <Icon name="mingcute:question-line" size="18" class="mb-[2px]" />
          Already have an account?&nbsp;
          <NuxtLink
            to="/signin"
            @click="authStore.errorMessage = ''"
            class="text-primary font-bold underline"
          >
            Log in instead!</NuxtLink
          >
        </div>
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

            <UiFormMessage class="ml-8 !mt-1" />
            <UiFormDescription class="text-sm mx-auto">{{
              item.description
            }}</UiFormDescription>
          </UiFormItem>
        </UiFormField>
        <Icon
          v-if="authStore.loader"
          name="line-md:loading-alt-loop"
          size="36"
          class="text-secondary"
        />
        <UiButton variant="outline" v-else type="submit">
          Get started
        </UiButton>
      </form>
    </div>
  </div>
</template>
