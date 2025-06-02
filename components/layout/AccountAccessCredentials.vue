<script setup lang="ts">
const route = useRoute();
const routePath = computed(() => route.path);
</script>
<template>
  <footer
    class="w-full flex justify-center items-center px-6 py-2 bg-newwhite/10 text-newwhite text-xs absolute top-0 left-0 z-10"
    v-if="routePath !== '/profile'"
  >
    <p class="flex items-center gap-1 mb-0 font-bold">
      <Icon name="carbon:data-vis-1" />Demo Account Login.
      <span class="italic">Email: test@gmail.com, Password: 123456</span>
    </p>
  </footer>
</template>
