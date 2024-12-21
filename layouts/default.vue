<script setup lang="ts">
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { useLoaderStore } from "@/stores/loader";

const loaderStore = useLoaderStore();

const auth = getAuth();
const currentUser = ref<User | null>(null);

onMounted(() => {
  loaderStore.setLoading(true);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user);
      currentUser.value = user;
      loaderStore.setLoading(false);
    }
  });
});
</script>
<template>
  <div class="flex flex-row h-screen">
    <LayoutLoader v-if="loaderStore.isLoading" />
    <template v-else>
      <LayoutSideBar v-if="currentUser" class="basis-1/6"></LayoutSideBar>
      <main :class="currentUser ? 'basis-5/6' : 'basis-full'">
        <slot></slot>
      </main>
    </template>
  </div>
</template>
