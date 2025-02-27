<script setup lang="ts">
import { useBoardsStore, type IBoard } from "@/stores/boards";
import type { Timestamp } from "firebase/firestore";

definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const boardStore = useBoardsStore();
const board = ref<IBoard | null>();

onMounted(async () => {
  await boardStore.getBoards();
  board.value = await boardStore.getBoard(route.params.id as string);
  if (!board.value) {
    await router.push("/dashboard");
  }
});

// Функция для форматирования даты
const formatDate = (date: string | Date | Timestamp) => {
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? "Invalid Date"
      : parsedDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  }
  if (date instanceof Date) {
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (date && typeof date.toDate === "function") {
    return date.toDate().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};
</script>
<template>
  <LayoutLoader v-if="boardStore.loader" />
  <div
    v-else
    class="board-main-content flex flex-col duration-300"
    :style="{ 'background-image': board?.gradient, opacity: board ? 1 : 0 }"
  >
    <div
      class="board-header h-16 flex flex-row justify-between items-center relative"
    >
      <UiSheet>
        <UiSheetTrigger as-child class="relative z-20">
          <UiButton variant="ghost">
            <h2 class="normal-case mb-0">
              {{ board?.boardName }}
            </h2>
          </UiButton>
        </UiSheetTrigger>
        <UiSheetContent class="w-72">
          <UiSheetHeader>
            <UiSheetTitle>{{ board?.boardName }}</UiSheetTitle>
          </UiSheetHeader>
          <div>
            <UiSheetDescription>
              {{ board?.boardDescription }}</UiSheetDescription
            >
          </div>
          <UiSheetFooter
            ><span class="text-xs">
              Created:
              {{ board?.createdAt ? formatDate(board?.createdAt) : "Unknown" }}
            </span>
          </UiSheetFooter>
        </UiSheetContent>
      </UiSheet>
      <div class="absolute inset-0 bg-slate-500/50 z-10"></div>
    </div>
    <div class="board-canvas p-2 h-svh flex-grow">
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet
        exercitationem placeat impedit consequuntur maxime nostrum in cumque,
        aspernatur quidem sint repellendus, asperiores temporibus error sed eos
        corporis excepturi odit est!
      </p>
    </div>
  </div>
</template>

<style scoped></style>
