<script setup lang="ts">
const props = defineProps<{
  boardId: string | undefined;
  description: string;
  onRemove: () => Promise<void>;
}>();

const loader = ref(false);

const handleRemove = async () => {
  loader.value = true;

  try {
    await props.onRemove();
  } catch (error) {
    console.error("Error during removal:", error);
  } finally {
    loader.value = false;
  }
};
</script>
<template>
  <UiAlertDialog>
    <UiAlertDialogTrigger>
      <slot name="alertTrigger" />
    </UiAlertDialogTrigger>
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle class="normal-case"
          >Are you absolutely sure?</UiAlertDialogTitle
        >
        <UiAlertDialogDescription>
          {{ props.description }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel>Cancel</UiAlertDialogCancel>
        <UiAlertDialogAction @click="handleRemove"
          ><template v-if="loader">
            <Icon name="line-md:loading-alt-loop" size="18" />
          </template>
          <template v-else> Remove </template></UiAlertDialogAction
        >
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style scoped></style>
