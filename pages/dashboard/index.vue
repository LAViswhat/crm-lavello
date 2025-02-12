<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});
</script>
<template>
  <div class="p-10">
    <LayoutBoardsBoardList />
  </div>
</template>

<style scoped></style>
