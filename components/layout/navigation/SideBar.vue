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
  <aside class="px-5 py-6 bg-newblack h-full w-full relative">
    <NuxtLink to="/">
      <NuxtImg src="/logo.png" width="160"></NuxtImg>
    </NuxtLink>
    <LayoutNavigationSideBar__Menu class="mt-12" />
  </aside>
</template>
