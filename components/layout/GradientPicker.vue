<script setup lang="ts">
const gradients = [
  "linear-gradient(90deg, hsla(233, 100%, 90%, 1) 0%, hsla(0, 0%, 89%, 1) 100%)",
  "linear-gradient(90deg, hsla(220, 78%, 29%, 1) 0%, hsla(221, 45%, 73%, 1) 100%)",
  "linear-gradient(90deg, hsla(333, 100%, 53%, 1) 0%, hsla(33, 94%, 57%, 1) 100%)",
  "linear-gradient(90deg, hsla(186, 66%, 40%, 1) 0%, hsla(188, 78%, 69%, 1) 100%)",
  "linear-gradient(90deg, hsla(165, 89%, 31%, 1) 0%, hsla(161, 46%, 49%, 1) 100%)",
  "linear-gradient(90deg, hsla(205, 46%, 10%, 1) 0%, hsla(191, 28%, 23%, 1) 50%, hsla(207, 41%, 27%, 1) 100%)",
  "linear-gradient(90deg, hsla(97, 56%, 42%, 1) 0%, hsla(92, 55%, 62%, 1) 100%)",
  "linear-gradient(90deg, hsla(22, 94%, 79%, 1) 0%, hsla(40, 63%, 85%, 1) 100%)",
  "linear-gradient(90deg, hsla(50, 57%, 47%, 1) 0%, rgb(247, 210, 103) 100%)",
];
const props = defineProps<{ selectedGradient: string }>();
const emit = defineEmits(["select-gradient"]);

const selectedGradient = ref(props.selectedGradient);

const selectGradient = (gradient: string) => {
  selectedGradient.value = gradient;
  emit("select-gradient", gradient);
};
</script>

<template>
  <div>
    <h4 class="mb-1">Choose your cover gradient:</h4>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(gradient, index) in gradients"
        :key="index"
        class="w-14 h-12 rounded-lg cursor-pointer duration-200 hover:scale-[1.1]"
        :class="{ 'border-primary border-4': gradient === selectedGradient }"
        :style="{ 'background-image': gradient }"
        @click="selectGradient(gradient)"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
