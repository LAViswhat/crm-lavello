<template>
  <footer
    class="w-full flex justify-around items-center px-6 py-2 bg-newblack/10 text-newblack text-sm fixed bottom-0 left-0 z-20"
  >
    <a href="/" class="hover:underline font-semibold">Home</a>
    <span class="flex items-center gap-1"
      >&copy; {{ new Date().getFullYear() }} LAViswhat, made with
      <Icon name="mingcute:heart-fill"
    /></span>
  </footer>
</template>
