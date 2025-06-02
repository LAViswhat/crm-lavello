<script setup lang="ts">
const route = useRoute();
const routePath = computed(() => route.path);
</script>
<template>
  <footer
    class="w-full flex justify-around items-center px-6 py-6 bg-transparent text-newwhite text-sm fixed bottom-0 left-0 z-10"
    :class="{
      'border-t-2': routePath === '/profile',
      '!bg-newblack': routePath === '/profile',
    }"
  >
    <a
      href="/"
      class="hover:underline font-semibold"
      :class="{ 'opacity-0': routePath === '/' }"
      >Home</a
    >
    <span class="flex items-center gap-1"
      >&copy; {{ new Date().getFullYear() }} LAViswhat, made with
      <Icon name="mingcute:heart-fill"
    /></span>
  </footer>
</template>
