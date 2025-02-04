<script setup lang="ts">
import { useLoaderStore } from "@/stores/loader";

const loaderStore = useLoaderStore();

onMounted(async () => {
  loaderStore.setLoading(true);
  loaderStore.setLoading(false);
});
</script>
<template>
  <div class="flex flex-row h-screen">
    <LayoutLoader v-if="loaderStore.isLoading" />
    <template v-else>
      <LayoutSideBar class="basis-1/6"></LayoutSideBar>
      <main class="'basis-5/6">
        <slot></slot>
      </main>
    </template>
  </div>
</template>
