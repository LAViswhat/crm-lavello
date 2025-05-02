<script setup lang="ts"></script>
<template>
  <div
    class="my-2 flex flex-col justify-between items-end gap-2 md:mt-0 md:flex-row md:justify-end md:items-center"
  >
    <div class="flex items-center gap-4 pr-1 order-2 md:order-1">
      <LayoutNavigationHeaderBoardsSearch />
      <LayoutNavigationHeaderBoardsSort />
    </div>
    <LayoutNavigationHeaderMenuBar class="order-1 md:order-2" />
  </div>
</template>

<style scoped></style>
