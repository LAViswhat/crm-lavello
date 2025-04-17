<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'rounded-md border bg-card/70 text-card-foreground shadow min-w-[255px] max-w-[300px] transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xl cursor-pointer',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
