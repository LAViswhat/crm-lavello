<script setup></script>
<template>
  <div class="flex flex-row h-screen">
    <LayoutSideBar class="basis-1/6"></LayoutSideBar>
    <main class="basis-5/6">
      <slot></slot>
    </main>
  </div>
</template>
