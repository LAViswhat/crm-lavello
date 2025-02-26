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
      <UiSidebarProvider>
        <LayoutNavigationSidebar></LayoutNavigationSidebar>
        <UiSidebarInset>
          <header
            class="flex flex-row justify-between md:justify-end border bg-newblack border-newblack border-b-gray-400"
          >
            <UiSidebarTrigger class="flex md:hidden -ml-1 text-primary" />
            <LayoutNavigationHeader></LayoutNavigationHeader>
          </header>
          <slot />
        </UiSidebarInset>
      </UiSidebarProvider>
    </template>
  </div>
</template>
