<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  editable?: boolean;
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
  () => props.modelValue,
  (val) => {
    if (val !== content.value && editor) {
      content.value = val || "";
      editor.value?.commands.setContent(val || "");
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
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            bold
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            italic
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
          >
            strike
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }"
          >
            paragraph
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          >
            h1
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          >
            h2
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          >
            h3
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          >
            h4
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
          >
            bullet list
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
          >
            ordered list
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().setHorizontalRule().run()"
          >
            horizontal rule
          </UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            @click="editor.chain().focus().setHardBreak().run()"
          >
            hard break
          </UiButton>
        </div>
        <TiptapEditorContent :editor="editor" />
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
.prose :deep(p) {
  margin: 0;
}
</style>
