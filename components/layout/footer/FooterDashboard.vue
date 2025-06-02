<template>
  <footer
    class="w-full flex justify-around items-center px-6 py-4 bg-slate-100 text-newblack text-sm border-t-2 border-t-newblack/10 fixed bottom-0 left-0 z-20"
  >
    <div class="flex justify-between items-center gap-2">
      <a href="/" class="hover:underline font-semibold">HOME</a>
      <UiSeparator orientation="vertical" class="bg-newblack h-4" />
      <a href="/profile" class="hover:underline font-semibold">PROFILE</a>
    </div>
    <span class="flex items-center gap-1"
      >&copy; {{ new Date().getFullYear() }} LAViswhat, made with
      <Icon name="mingcute:heart-fill"
    /></span>
  </footer>
</template>
