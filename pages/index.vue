<script setup lang="ts"></script>

<template>
  <div class="h-full flex items-center justify-center bg-newblack">
    <div class="mx-4 flex flex-col items-end">
      <div class="w-full">
        <NuxtImg src="/main_logo.png" width="240" />
      </div>
      <h4 class="text-2xl pl-2 tracking-wider">
        CRM - for something I'll figure out later!
      </h4>
      <div class="w-full pl-2 flex flex-col md:flex-row gap-2">
        <UiButton as-child size="lg">
          <NuxtLink to="/register">Register</NuxtLink>
        </UiButton>
        <UiButton as-child variant="outline" size="lg">
          <NuxtLink to="/signin">Sign In</NuxtLink>
        </UiButton>
      </div>
    </div>
    <div class="md:block hidden">
      <NuxtImg src="/thmb_banner.png" width="480" />
    </div>
  </div>
</template>

<style scoped></style>
