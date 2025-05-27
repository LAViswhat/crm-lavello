<script setup lang="ts">
import { useLoaderStore } from "@/stores/loader";
definePageMeta({
  layout: "default",
  middleware: "auth",
});

const authStore = useAuthStore();

const loaderStore = useLoaderStore();
const { setLoading } = loaderStore;

const handleSignOut = async () => {
  setLoading(true);
  await authStore.signOut();
  setLoading(false);
};
</script>
<template>
  <div class="bg-newwhite min-h-screen">
    <header class="flex justify-between items-center min-h-6 bg-newblack z-40">
      <NuxtLink to="/dashboard" class="flex items-center gap-2 pl-8">
        <NuxtImg src="/mini_logo.png" class="w-14 h-auto" />
        <span class="text-secondary text-3xl pl-3">LAVello</span>
      </NuxtLink>
      <UiMenubar>
        <UiMenubarMenu>
          <UiMenubarTrigger class="bg-newblack p-2">
            <img src="/public/profile.svg" />
          </UiMenubarTrigger>
          <UiMenubarContent side="bottom" class="bg-newwhite border-0">
            <UiMenubarItem
              ><div
                class="flex items-center gap-2 cursor-pointer"
                @click="handleSignOut"
              >
                <Icon name="line-md:logout" size="20" class="text-newblack" />
                <span>Log out</span>
              </div></UiMenubarItem
            >
          </UiMenubarContent>
        </UiMenubarMenu>
      </UiMenubar>
    </header>
    <aside>
      <section
        class="fixed inset-y-0 left-0 bg-white w-full h-fit xl:h-full xl:w-80 mt-16"
      >
        <ClientOnly>
          <div class="flex flex-col justify-start items-center h-full">
            <div class="flex items-center justify-center gap-1 px-2 py-6">
              <img src="/public/profile.svg" width="52" height="52" />
              <h2 class="mb-0 normal-case text-xl xl:text-3xl">Settings</h2>
            </div>
            <div class="flex flex-col px-4 pb-4">
              <h4
                class="text-base xl:text-xl mb-0 inline-flex flex-wrap items-center gap-1"
              >
                Email address:
                <span class="text-newblack text-sm xl:text-lg">{{
                  authStore.currentUser?.email
                }}</span>
              </h4>
              <h4
                class="text-base xl:text-xl mt-4 mb-0 inline-flex items-center gap-1"
                v-if="authStore.currentUser?.displayName"
              >
                Account name:
                <span class="text-newblack text-sm xl:text-lg">{{
                  authStore.currentUser?.displayName
                }}</span>
              </h4>
            </div>
          </div>
        </ClientOnly>
      </section>
    </aside>
    <main class="min-h-full mt-48 xl:mt-0">
      <section class="flex flex-1 justify-center mt-32 my-8">
        <div class="bg-white rounded-md p-8 w-full max-w-screen-md">
          <h3 class="normal-case text-newblack text-2xl">Account access</h3>
          <ul class="pl-0 flex flex-col gap-2">
            <li>
              <UiDialog>
                <UiDialogTrigger
                  class="w-full inline-flex justify-between items-center duration-200 ease-in-out hover:-translate-y-0.5 hover:opacity-80"
                >
                  Change account name
                  <Icon name="fluent:arrow-right-12-filled" />
                </UiDialogTrigger>
                <LayoutProfileNameChangerDialog />
              </UiDialog>
            </li>
            <UiSeparator />
            <li>
              <UiDialog>
                <UiDialogTrigger
                  class="w-full inline-flex justify-between items-center duration-200 ease-in-out hover:-translate-y-0.5 hover:opacity-80"
                >
                  Change password
                  <Icon name="fluent:arrow-right-12-filled" />
                </UiDialogTrigger>
                <LayoutProfilePasswordChangerDialog />
              </UiDialog>
            </li>
            <UiSeparator />
            <li>
              <UiAlertDialog>
                <UiAlertDialogTrigger
                  class="w-full inline-flex justify-between items-center duration-200 ease-in-out hover:-translate-y-0.5 hover:opacity-80"
                >
                  Delete account
                  <Icon name="fluent:arrow-right-12-filled" />
                </UiAlertDialogTrigger>
                <LayoutProfileAccountRemoverDialog />
              </UiAlertDialog>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped></style>
