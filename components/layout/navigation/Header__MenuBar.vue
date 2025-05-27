<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "@/stores/loader";

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
  <UiMenubar>
    <UiMenubarMenu>
      <UiMenubarTrigger class="bg-newblack">
        <div class="flex items-center justify-between gap-1">
          <img src="/public/profile.svg" />
          <div class="flex flex-col items-start text-sm text-newwhite">
            <span>{{ authStore.currentUser?.email }}</span>
            <span class="font-bold" v-if="authStore.currentUser?.displayName">{{
              authStore.currentUser?.displayName
            }}</span>
          </div>
        </div>
      </UiMenubarTrigger>
      <UiMenubarContent side="bottom" class="bg-newwhite border-0">
        <UiMenubarItem>
          <div class="flex items-center gap-2">
            <Icon name="lucide:settings" size="20" class="text-newblack" />
            <NuxtLink to="/profile"> <span>Profile settings</span></NuxtLink>
          </div>
        </UiMenubarItem>
        <UiMenubarSeparator class="bg-0" />
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
</template>

<style scoped></style>
