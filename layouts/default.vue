<script setup lang="ts">
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

const auth = getAuth();
const currentUser = ref<User | null>(null);
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user);
      currentUser.value = user;
    }
  });
});
</script>
<template>
  <div class="flex flex-row h-screen">
    <LayoutSideBar v-if="currentUser" class="basis-1/6"></LayoutSideBar>
    <main :class="currentUser ? 'basis-5/6' : 'basis-full'">
      <slot></slot>
    </main>
  </div>
</template>
