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
      <LayoutNavigationSideBar class="basis-1/6"></LayoutNavigationSideBar>
      <div class="basis-5/6">
        <main>
          <slot></slot>
        </main>
      </div>
    </template>
  </div>
</template>
