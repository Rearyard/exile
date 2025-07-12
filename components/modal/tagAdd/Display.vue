<template>
  <div class="border border-dashed rounded-lg text-sm px-4 py-3">
    <div v-if="isEmpty" class="flex items-center justify-center h-full w-full text-xs">
      <div class="text-muted-foreground">已添加的标签将展示在这里</div>
    </div>
    <div v-auto-animate v-else class="flex items-center gap-2 flex-wrap">
      <div v-for="tag in tags" :key="tag.id" class="text-sm shrink-0">
        <Badge variant="closeable" @close="removeTag(tag)">
          {{ tag.name }}
        </Badge>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useTagAddInject } from './index';
import { Badge } from '~/components/ui/badge';
const { tags, removeTag } = useTagAddInject();
const isEmpty = computed(() => {
  return tags.value.length === 0;
})
</script>

<style>

</style>