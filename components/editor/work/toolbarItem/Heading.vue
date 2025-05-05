<script setup lang="ts">
import type {Editor} from '@tiptap/vue-3';
import type {ShallowRef} from 'vue';
import {DropdownMenu, DropdownMenuTrigger} from '~/components/ui/dropdown-menu';
import {Tooltip} from '~/components/ui/tooltip';

const editor = inject<ShallowRef<Editor>>('editor')

const isActive = computed(() => {
  return !!editor?.value?.isActive('heading')
})

function isActiveLevel(level: number) {
  return !!editor?.value?.isActive('heading', {
    level,
  })
}

function handleSetHeadingLevel(level: number) {
  editor?.value?.chain().focus().toggleHeading({level}).run()
}
</script>

<template>
<div>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Tooltip>
        <TooltipTrigger>
          <div
              class="cursor-pointer hover:bg-muted transition w-8 h-8 rounded flex justify-center items-center"
              :class="{
            'bg-muted': isActive,
          }"
          >
            <Icon name="gridicons:heading"></Icon>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Heading</p>
        </TooltipContent>
      </Tooltip>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Headings</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem v-for="i in 3" :key="i" :class="{
        'mb-1': i < 3,
        'bg-accent': isActiveLevel(i),
      }" @click="handleSetHeadingLevel(i)"><Icon :name="`gravity-ui:heading-${i}`" />Heading {{ i }}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
</template>

<style scoped>

</style>
