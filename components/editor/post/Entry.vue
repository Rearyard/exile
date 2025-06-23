<template>
  <div class="min-h-[100px] max-h-[300px] cursor-text overflow-y-auto wrapper" @click="focusEditor">
    <EditorContent :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import { Editor, EditorContent, mergeAttributes } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import suggestion from './suggestion'

const editor = shallowRef<Editor | undefined>(undefined);

function focusEditor() {
  editor.value?.commands.focus();
}

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, Placeholder.configure({
      placeholder: '有什么新灵感？'
    }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),
    ],
  });
});
</script>

<style scoped>
:deep(.tiptap) {
  outline: 0;
  border: 0;
  height: 100%;
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* pretty scrollbar */
.wrapper::-webkit-scrollbar {
  width: 8px;
}

.wrapper::-webkit-scrollbar-thumb {
  background-color: #adb5bd;
  border-radius: 4px;
}

:deep(.mention) {
  color: var(--primary);
}
</style>