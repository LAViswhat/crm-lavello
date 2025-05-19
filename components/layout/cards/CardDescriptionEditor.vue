<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  editable?: boolean;
  isEditing?: boolean;
}>();
const emit = defineEmits(["update:modelValue", "save", "cancel"]);

const content = ref(props.modelValue || "");
const isEditing = ref(false);

const editor = useEditor({
  content: content.value,
  extensions: [TiptapStarterKit],
  onUpdate({ editor }) {
    content.value = editor.getHTML();
    emit("update:modelValue", content.value);
  },
});

watch(
  () => props.isEditing,
  (val) => {
    if (val && !isEditing.value) {
      startEdit();
    }
    if (!val && isEditing.value) {
      isEditing.value = false;
    }
  }
);

function startEdit() {
  if (!props.editable) return;
  isEditing.value = true;
  nextTick(() => {
    editor && editor.value?.commands.focus("end");
  });
}

function save() {
  emit("save", content.value);
  isEditing.value = false;
}
function cancel() {
  emit("cancel");
  isEditing.value = false;
}
</script>

<template>
  <div>
    <!-- Просмотр -->
    <div
      v-if="!isEditing"
      @click="startEdit"
      class="min-h-[40px] cursor-pointer prose prose-sm max-w-none pl-3 text-sm"
    >
      <div v-if="content" v-html="content" />
      <span v-else class="text-gray-400"
        >Add some additional information about the card here...</span
      >
    </div>
    <!-- Редактирование -->
    <div v-else>
      <div>
        <div class="flex flex-wrap items-center gap-1 mb-2" v-if="editor">
          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child
                ><UiButton
                  variant="secondary"
                  size="sm"
                  @click="editor.chain().focus().toggleBold().run()"
                  :disabled="!editor.can().chain().focus().toggleBold().run()"
                  :class="{ 'is-active': editor.isActive('bold') }"
                >
                  <Icon name="octicon:bold-16" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">Bold</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  variant="secondary"
                  size="sm"
                  @click="editor.chain().focus().toggleItalic().run()"
                  :disabled="!editor.can().chain().focus().toggleItalic().run()"
                  :class="{ 'is-active': editor.isActive('italic') }"
                >
                  <Icon name="octicon:italic-16" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">Italic</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child
                ><UiButton
                  variant="secondary"
                  size="sm"
                  @click="editor.chain().focus().toggleStrike().run()"
                  :disabled="!editor.can().chain().focus().toggleStrike().run()"
                  :class="{ 'is-active': editor.isActive('strike') }"
                >
                  <Icon name="octicon:strikethrough-16" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">Strike</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  variant="secondary"
                  size="sm"
                  @click="editor.chain().focus().setParagraph().run()"
                  :class="{ 'is-active': editor.isActive('paragraph') }"
                >
                  <Icon name="fa-solid:paragraph" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">Paragraph</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  variant="secondary"
                  size="sm"
                  @click="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  "
                  :class="{
                    'is-active': editor.isActive('heading', { level: 1 }),
                  }"
                >
                  <Icon name="heroicons:h1-16-solid" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">H1</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  variant="secondary"
                  size="sm"
                  @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  "
                  :class="{
                    'is-active': editor.isActive('heading', { level: 2 }),
                  }"
                >
                  <Icon name="heroicons:h2-16-solid" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">H2</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiButton
                  variant="secondary"
                  size="sm"
                  @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  "
                  :class="{
                    'is-active': editor.isActive('heading', { level: 3 }),
                  }"
                >
                  <Icon name="heroicons:h3-16-solid" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">H3</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child
                ><UiButton
                  variant="secondary"
                  size="sm"
                  @click="
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                  "
                  :class="{
                    'is-active': editor.isActive('heading', { level: 4 }),
                  }"
                >
                  <Icon name="codex:h4" size="20" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">H4</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child
                ><UiButton
                  variant="secondary"
                  size="sm"
                  @click="editor.chain().focus().toggleOrderedList().run()"
                  :class="{ 'is-active': editor.isActive('orderedList') }"
                >
                  <Icon name="fluent:list-16-filled" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">List</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child
                ><UiButton
                  variant="secondary"
                  size="sm"
                  @click="editor.chain().focus().setHardBreak().run()"
                >
                  <Icon name="icon-park:paragraph-break" size="16" /> </UiButton
              ></UiTooltipTrigger>
              <UiTooltipContent class="bg-gray-400 p-1" side="bottom">
                <p class="text-xs m-0">Hard break</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>
        </div>
        <TiptapEditorContent class="bg-newwhite" :editor="editor" />
      </div>
      <div class="flex gap-2 mt-2">
        <UiButton size="sm" @click="save">Save</UiButton>
        <UiButton size="sm" variant="destructive" @click="cancel"
          >Cancel</UiButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ProseMirror) {
  @apply p-2;
}

:deep(.ProseMirror-focused) {
  @apply outline-primary;
}

:deep(p) {
  @apply m-0 font-medium;
}

:deep(ul) {
  @apply list-disc;
}

.is-active {
  @apply text-primary bg-gray-700/30;
}
</style>
