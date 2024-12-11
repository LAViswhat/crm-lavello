<script setup lang="ts">
import { MENU_DATA } from "./menu.data";
</script>
<template>
  <div>
    <NuxtLink
      class="flex items-center text-newwhite capitalize font-bold duration-300 hover:text-[#1b9b4f] py-2 px-4 mb-4 w-full rounded-md hover:bg-newwhite hover:opacity-70"
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
