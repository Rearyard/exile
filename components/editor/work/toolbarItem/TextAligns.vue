<script setup lang="ts">
import type {ShallowRef} from 'vue';
import type {Editor} from '@tiptap/vue-3';
import TextAlign from '@tiptap/extension-text-align';

const editor = inject<ShallowRef<Editor>>('editor')

const aligns = [
  {value: 'left', icon: 'gravity-ui:text-align-left'},
  {value: 'center', icon: 'gravity-ui:text-align-center'},
  {value: 'right', icon: 'gravity-ui:text-align-right'},
  {value: 'justify', icon: 'gravity-ui:text-align-justify'},
]


function isActive(align: string) {
  return editor?.value?.isActive({ textAlign: align });
}

function toggleAlign(align: string) {
  console.log('align', align);
  const currentAlign = editor?.value?.getAttributes('textAlign')?.textAlign;
  if (currentAlign === align) {
    return editor?.value?.chain().focus().unsetTextAlign().run();
  }
  return editor?.value?.chain().focus().toggleTextAlign(align).run();
}
</script>

<template>
  <Tooltip v-for="item in aligns" :key="item.value">
    <TooltipTrigger>
      <div
          class="cursor-pointer hover:bg-muted transition w-8 h-8 rounded flex justify-center items-center"
          :class="{
        'bg-muted': isActive(item.value),
      }"
          @click="toggleAlign(item.value)"
      >
        <Icon :name="item.icon"></Icon>
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>
        Align {{ item.value.charAt(0).toUpperCase() + item.value.slice(1) }}
      </p>
    </TooltipContent>
  </Tooltip>
</template>

<style scoped>

</style>
