<template>
  <aside class="px-5 py-8 bg-secondary h-full w-full relative">
    <UiButton variant="ghost" class="absolute top-2 right-1">
      <Icon name="line-md:logout" size="24" />
    </UiButton>
    <NuxtLink to="/">
      <NuxtImg
        src="/logo.png"
        width="160"
        class="absolute top-2 left-2"
      ></NuxtImg>
    </NuxtLink>
    <LayoutSideBar__Menu class="mt-44" />
  </aside>
</template>
