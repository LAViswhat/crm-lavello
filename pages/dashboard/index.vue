<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});
</script>
<template>
  <div class="p-10">
    <UiButton variant="outline" size="md">
      <Icon name="line-md:plus-circle-filled" size="36" class="text-primary" />
      <span>Create new board</span>
    </UiButton>
  </div>
</template>

<style scoped></style>
