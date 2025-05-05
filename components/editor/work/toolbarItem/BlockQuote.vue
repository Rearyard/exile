<script setup lang="ts">
import type {ShallowRef} from 'vue';
import type {Editor} from '@tiptap/vue-3';

const editor = inject<ShallowRef<Editor>>('editor')

const isActive = computed(() => {
  return !!editor?.value?.isActive('blockquote')
})

function toggleBlockQuote() {
  editor?.value?.chain().focus().toggleBlockquote().run()
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
          @click="toggleBlockQuote"
      >
        <Icon name="gravity-ui:quote-close"></Icon>
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>Block Quote</p>
    </TooltipContent>
  </Tooltip>
</template>

<style scoped>

</style>
