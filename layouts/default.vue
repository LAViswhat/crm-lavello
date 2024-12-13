<script setup lang="ts">
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>
<template>
  <div class="flex flex-row h-screen">
    <LayoutSideBar v-if="authStore.isAuth" class="basis-1/6"></LayoutSideBar>
    <main :class="authStore.isAuth ? 'basis-5/6' : 'basis-full'">
      <slot></slot>
    </main>
  </div>
</template>
