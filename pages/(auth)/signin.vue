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
      .min(8, { message: "Too short" }),
    username: z.string(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const authStore = useAuthStore();
const router = useRouter();

const onSubmit = form.handleSubmit(async (values) => {
  await authStore.auth(
    {
      email: values.email,
      password: values.password,
      username: values.username,
    },
    "signin"
  );
  authStore.isAuth = true;
  await router.push("/");
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
        v-if="authStore.error"
        variant="destructive"
        class="fixed top-2 left-0 right-0 mx-auto w-1/4 mb-12 bg-orange border-l-8 z-50 shadow-lg"
      >
        <div class="inline-flex gap-1 items-center">
          <Icon name="line-md:alert-loop" size="18" />
          <UiAlertTitle class="text-xl mb-0">{{
            authStore.error
          }}</UiAlertTitle>
        </div>
      </UiAlert>
    </Transition>
    <div
      class="absolute top-0 left-0 bottom-0 right-0 bg-lime-800 opacity-30 z-0"
    ></div>
    <div
      class="rounded-md bg-newwhite shadow-md border-secondary w-1/4 max-w-sm px-2 py-4 z-10 relative"
    >
      <header
        class="bg-primary rounded-md flex justify-center items-center w-3/4 absolute top-3 left-2/4 -translate-x-2/4 -translate-y-2/4"
      >
        <h2 class="text-newwhite capitalize pt-2">Log in</h2>
      </header>
      <form
        @submit="onSubmit"
        class="mt-12 flex flex-col items-center justify-center gap-4 px-4"
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
          class="text-orange"
        />
        <UiButton v-else type="submit"> Let's go </UiButton>
        <div class="mx-auto text-secondary">
          No account yet?
          <NuxtLink
            to="/register"
            @click="authStore.error = ''"
            class="text-primary font-bold underline"
            >Create one here</NuxtLink
          >
        </div>
      </form>
    </div>
  </div>
</template>
