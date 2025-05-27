<script setup lang="ts">
const authStore = useAuthStore();
const name = ref(authStore.currentUser?.displayName || "");

const onSave = async () => {
  if (!name.value.trim()) return;
  await authStore.changeDisplayName(name.value.trim());
};
</script>
<template>
  <UiDialogContent>
    <UiDialogHeader class="text-left">
      <UiDialogTitle> Change Name </UiDialogTitle>
      <UiDialogDescription>
        Make changes to your account name here. Click save when you're done.
      </UiDialogDescription>
    </UiDialogHeader>
    <div>
      <form @submit.prevent="onSave">
        <UiFormField name="name">
          <UiFormItem>
            <UiFormLabel>Name</UiFormLabel>
            <UiFormControl>
              <UiInput v-model="name" placeholder="Enter your name" />
            </UiFormControl>
          </UiFormItem>
        </UiFormField>
        <UiDialogFooter class="!justify-start mt-4">
          <UiButton type="submit">
            <Icon
              v-if="authStore.loader"
              name="line-md:loading-alt-loop"
              size="36"
              class="text-secondary"
            />
            <span v-else>Save changes</span>
          </UiButton>
        </UiDialogFooter>
      </form>
      <div v-if="authStore.errorMessage" class="text-primary mt-2">
        {{ authStore.errorMessage }}
      </div>
    </div>
  </UiDialogContent>
</template>

<style scoped></style>
