<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});
</script>
<template>
  <div class="p-8">
    <div class="flex items-center gap-1 pb-2">
      <Icon name="iconamoon:profile-fill" size="32" class="text-primary" />
      <h3 class="mb-0 normal-case">My boards</h3>
    </div>
    <LayoutBoardsBoardList />
  </div>
</template>

<style scoped></style>
