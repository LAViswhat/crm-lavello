<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "./utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-16 w-16', props.class)"
    @click="toggleSidebar"
  >
    <Icon name="octicon:sidebar-expand-16" size="24" class="rotate-180" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
