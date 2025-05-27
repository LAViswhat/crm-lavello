<script setup lang="ts">
const authStore = useAuthStore();

const showReauth = ref(false);
const reauthEmail = ref("");
const reauthPassword = ref("");

const onDeleteAccount = async () => {
  try {
    await authStore.deleteAccount();
  } catch (error: any) {
    if (error.code === "auth/requires-recent-login") {
      showReauth.value = true;
    }
  }
};

const onReauth = async () => {
  try {
    await authStore.reauthenticateUser(reauthEmail.value, reauthPassword.value);
    showReauth.value = false;
    await onDeleteAccount();
  } catch (error) {
    authStore.errorMessage = "Reauthentication failed. Please try again.";
  }
};
</script>
<template>
  <UiAlertDialogContent>
    <UiAlertDialogHeader>
      <UiAlertDialogTitle class="normal-case"
        >Are you absolutely sure?</UiAlertDialogTitle
      >
      <UiAlertDialogDescription>
        This action will permanently remove your account and all associated
        data.
        <br />
        Please confirm if you wish to proceed.
      </UiAlertDialogDescription>
    </UiAlertDialogHeader>
    <UiAlertDialogFooter>
      <UiAlertDialogCancel>Cancel</UiAlertDialogCancel>
      <UiAlertDialogAction @click="onDeleteAccount"
        ><template v-if="authStore.loader">
          <Icon name="line-md:loading-alt-loop" size="18" />
        </template>
        <template v-else>Remove</template></UiAlertDialogAction
      >
    </UiAlertDialogFooter>
  </UiAlertDialogContent>
  <UiDialog v-model:open="showReauth">
    <UiDialogContent>
      <UiDialogHeader class="text-left">
        <UiDialogTitle>Re-authenticate</UiDialogTitle>
        <UiDialogDescription>
          Please enter your email and current password to continue.
        </UiDialogDescription>
      </UiDialogHeader>
      <form @submit.prevent="onReauth" class="flex flex-col gap-2">
        <UiInput v-model="reauthEmail" placeholder="Email" type="email" />
        <UiInput
          v-model="reauthPassword"
          placeholder="Current password"
          type="password"
        />
        <UiButton type="submit">
          <span>Continue</span>
        </UiButton>
      </form>
      <div v-if="authStore.errorMessage" class="text-primary mt-2">
        {{ authStore.errorMessage }}
      </div>
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped></style>
