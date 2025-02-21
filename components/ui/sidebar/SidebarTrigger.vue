<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-vue-next";
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
    <Icon name="icon-park-outline:expand-right" size="24" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
