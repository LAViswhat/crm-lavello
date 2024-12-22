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
  <aside class="px-5 py-8 bg-newblack h-full w-full relative">
    <UiButton variant="ghost" class="absolute top-2 right-1">
      <Icon name="line-md:logout" size="24" @click="handleSignOut" />
    </UiButton>
    <NuxtLink to="/">
      <NuxtImg
        src="/logo.png"
        width="160"
        class="absolute top-2 left-2"
      ></NuxtImg>
    </NuxtLink>
    <LayoutSideBar__Menu class="mt-44" />
  </aside>
</template>
