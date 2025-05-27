<script setup lang="ts">
const authStore = useAuthStore();

const newPassword = ref("");
const confirmPassword = ref("");
const showNew = ref(false);
const showConfirm = ref(false);

const showReauth = ref(false);
const reauthEmail = ref("");
const reauthPassword = ref("");

const onSave = async () => {
  if (
    !newPassword.value.trim() ||
    newPassword.value !== confirmPassword.value
  ) {
    authStore.errorMessage = "Passwords do not match or are empty.";
    return;
  }

  try {
    await authStore.changePassword(newPassword.value.trim());
    newPassword.value = "";
    confirmPassword.value = "";
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
    await onSave();
  } catch (error) {
    authStore.errorMessage = "Reauthentication failed. Please try again.";
  }
};
</script>
<template>
  <UiDialogContent>
    <UiDialogHeader class="text-left">
      <UiDialogTitle> Change Password </UiDialogTitle>
      <UiDialogDescription>
        Change your password here. Click save when you're done.
      </UiDialogDescription>
    </UiDialogHeader>
    <div>
      <form @submit.prevent="onSave">
        <UiFormField name="newPassword">
          <UiFormItem class="mb-4">
            <UiFormLabel>New password</UiFormLabel>
            <UiFormControl>
              <div class="relative">
                <UiInput
                  :type="showNew ? 'text' : 'password'"
                  v-model="newPassword"
                  placeholder="Enter new password here"
                  autocomplete="new-password"
                />
                <UiButton
                  variant="ghost"
                  size="sm"
                  @click="showNew = !showNew"
                  tabindex="-1"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <Icon :name="showNew ? 'mdi:eye-off' : 'mdi:eye'" size="20" />
                </UiButton>
              </div>
            </UiFormControl>
          </UiFormItem>
        </UiFormField>
        <UiFormField name="confirmPassword">
          <UiFormItem>
            <UiFormLabel>Confirm Password</UiFormLabel>
            <UiFormControl>
              <div class="relative">
                <UiInput
                  :type="showNew ? 'text' : 'password'"
                  v-model="confirmPassword"
                  placeholder="Confirm new password"
                  autocomplete="new-password"
                />
                <UiButton
                  variant="ghost"
                  size="sm"
                  @click="showConfirm = !showConfirm"
                  tabindex="-1"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <Icon
                    :name="showConfirm ? 'mdi:eye-off' : 'mdi:eye'"
                    size="20"
                  />
                </UiButton>
              </div>
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
      <div
        v-if="authStore.errorMessage"
        class="text-primary mt-2"
        :class="
          authStore.errorMessage === 'Passwords do not match or are empty.'
            ? 'text-red-500'
            : ''
        "
      >
        {{ authStore.errorMessage }}
      </div>
    </div>
  </UiDialogContent>
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
