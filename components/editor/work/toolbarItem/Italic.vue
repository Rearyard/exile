<script setup lang="ts">
import type {ShallowRef} from 'vue';
import type {Editor} from '@tiptap/vue-3';

const editor = inject<ShallowRef<Editor>>('editor')

const isActive = computed(() => {
  return !!editor?.value?.isActive('italic')
})

function toggleItalic() {
  editor?.value?.chain().focus().toggleItalic().run();
}
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <div
          class="cursor-pointer hover:bg-muted transition w-8 h-8 rounded flex justify-center items-center"
          :class="{
        'bg-muted': isActive,
      }"
          @click="toggleItalic"
      >
        <Icon name="gravity-ui:italic"></Icon>
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>
        Italic
      </p>
    </TooltipContent>
  </Tooltip>
</template>

<style scoped>

</style>
