<script setup lang="ts">
import { useLoaderStore } from "@/stores/loader";
import { useAuthStore } from "@/stores/auth";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();

onMounted(async () => {
  loaderStore.setLoading(true);
  loaderStore.setLoading(false);
});
</script>
<template>
  <div class="flex flex-row h-screen">
    <LayoutLoader v-if="loaderStore.isLoading" />
    <template v-else>
      <LayoutSideBar
        v-if="authStore.isAuthenticated"
        class="basis-1/6"
      ></LayoutSideBar>
      <main :class="authStore.isAuthenticated ? 'basis-5/6' : 'basis-full'">
        <slot></slot>
      </main>
    </template>
  </div>
</template>
