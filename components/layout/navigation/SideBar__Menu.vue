<script setup lang="ts">
import { MENU_DATA } from "./menu.data";
</script>
<template>
  <nav>
    <NuxtLink
      class="flex items-center gap-4 text-newwhite capitalize font-bold duration-300 hover:text-[#1b9b4f] py-2 px-4 mb-4 ml-3 w-full rounded-md hover:bg-newwhite hover:opacity-70"
      v-for="item in MENU_DATA"
      :key="item.name"
      :to="item.url"
    >
      <Icon :name="item.icon" size="24" />
      <span>{{ item.name }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped></style>
