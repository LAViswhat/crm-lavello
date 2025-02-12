<script setup lang="ts"></script>

<template>
  <div
    class="relative min-h-40 h-40 min-w-60 w-60 overflow-hidden p-2 flex flex-col items-start justify-start gap-2 rounded-lg text-lg font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 duration-500 shadow-xl hover:bg-gray-200 hover:text-secondary dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
  >
    <UiTooltipProvider>
      <UiTooltip>
        <UiTooltipTrigger
          as-child
          class="absolute top-0 right-0 -translate-x-1 translate-y-2 text-gray-500 cursor-pointer"
          ><Icon name="lucide:settings" size="18"
        /></UiTooltipTrigger>
        <UiTooltipContent>
          <p class="m-0">Settings</p>
        </UiTooltipContent>
      </UiTooltip>
    </UiTooltipProvider>

    <UiTooltipProvider>
      <UiTooltip>
        <UiTooltipTrigger
          as-child
          class="absolute top-full right-0 -translate-x-1 -translate-y-[120%] text-gray-500 cursor-pointer"
          ><Icon name="bi:trash2-fill" size="18"
        /></UiTooltipTrigger>
        <UiTooltipContent>
          <p class="m-0">Remove board</p>
        </UiTooltipContent>
      </UiTooltip>
    </UiTooltipProvider>

    <slot />
  </div>
</template>

<style scoped></style>
