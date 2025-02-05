<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "@/stores/loader";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

const authStore = useAuthStore();

const loaderStore = useLoaderStore();
const { setLoading } = loaderStore;

const handleSignOut = async () => {
  setLoading(true);
  await authStore.signOut();
  setLoading(false);
};
</script>
<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>
        <div class="flex items-center justify-between gap-1">
          <img src="/public/profile.svg" />
          <div class="flex flex-col items-start text-sm">
            <span>{{ authStore.currentUser?.email }}</span>
            <span class="font-bold" v-if="authStore.currentUser?.displayName">{{
              authStore.currentUser?.displayName
            }}</span>
          </div>
        </div>
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <div class="flex items-center gap-2">
            <Icon name="lucide:settings" size="20" class="text-newblack" />
            <span>Profile settings</span>
          </div>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
          ><div class="flex items-center gap-2" @click="handleSignOut">
            <Icon name="line-md:logout" size="20" class="text-newblack" />
            <span>Log out</span>
          </div></MenubarItem
        >
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>

<style scoped></style>
