<script setup lang="ts">
import { MENU_DATA } from "./menu.data";
</script>
<template>
  <div>
    <NuxtLink
      class="flex items-center py-2 px-3 w-full text-bg-color-primary uppercase duration-500 hover:text-primary"
      v-for="item in MENU_DATA"
      :key="item.name"
      :to="item.url"
    >
      <Icon :name="item.icon" class="mr-2" size="24" />
      <span>{{ item.name }}</span>
    </NuxtLink>
  </div>
</template>

<style scoped></style>
