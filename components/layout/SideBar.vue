<template>
  <aside class="px-5 py-8 bg-bg-color-secondary h-full w-full relative">
    <UiButton variant="ghost" class="absolute top-2 right-1">
      <Icon name="line-md:logout" size="28" />
    </UiButton>
    <NuxtLink to="/">
      <NuxtImg
        src="/logo.png"
        width="240"
        class="absolute -top-2 -left-8"
      ></NuxtImg>
    </NuxtLink>
    <LayoutMenu class="mt-40" />
  </aside>
</template>
