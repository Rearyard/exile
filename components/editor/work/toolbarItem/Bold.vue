<script setup lang="ts">
import type {ShallowRef} from 'vue';
import type {Editor} from '@tiptap/vue-3';

const editor = inject<ShallowRef<Editor>>('editor')

const isActive = computed(() => {
  return !!editor?.value?.isActive('bold')
})

function toggleBold() {
  editor?.value?.chain().focus().toggleBold().run();
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
          @click="toggleBold"
      >
        <Icon name="gravity-ui:bold"></Icon>
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>
        Bold
      </p>
    </TooltipContent>
  </Tooltip>
</template>

<style scoped>

</style>
