<script setup lang="ts">
import type {ShallowRef} from 'vue';
import type {Editor} from '@tiptap/vue-3';

const editor = inject<ShallowRef<Editor>>('editor')

const isActive = computed(() => {
  return !!editor?.value?.isActive('bold')
})

function toggleUnderline() {
  editor?.value?.chain().focus().toggleUnderline().run();
}
</script>

<template>
  <div
      class="cursor-pointer hover:bg-muted transition w-8 h-8 rounded flex justify-center items-center"
      :class="{
        'bg-muted': isActive,
      }"
      @click="toggleUnderline"
  >
    <Icon name="gravity-ui:underline"></Icon>
  </div>
</template>

<style scoped>

</style>
