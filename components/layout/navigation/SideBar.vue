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
  <aside class="px-5 pt-2 pb-6 bg-newblack h-full w-full relative">
    <NuxtLink
      to="/"
      class="flex items-center gap-4 text-newwhite capitalize font-bold duration-300 hover:text-[#1b9b4f] py-2 px-4 mb-4 w-full"
    >
      <NuxtImg src="/mini_logo.png" class="w-14 h-auto"></NuxtImg>
      <span class="text-secondary text-3xl">LAVello</span>
    </NuxtLink>
    <LayoutNavigationSideBar__Menu class="mt-12" />
  </aside>
</template>
