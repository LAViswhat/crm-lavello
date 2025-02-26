<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  MenubarTrigger,
  type MenubarTriggerProps,
  useForwardProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  MenubarTriggerProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <MenubarTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex cursor-pointer select-none items-center rounded-lg px-3 py-1 text-md text-newblack font-medium outline-none hover:bg-zinc-800 data-[state=open]:bg-newblack/80 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-50',
        props.class
      )
    "
  >
    <slot />
  </MenubarTrigger>
</template>
