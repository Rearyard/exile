<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { type BadgeVariants, badgeVariants } from '.'

const props = defineProps<{
  variant?: BadgeVariants['variant']
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
    <Icon v-if="props.variant === 'closeable'" name="tabler:x" class="w-4 h-4 mx-1 cursor-pointer" @click="emit('close')" />
  </div>
</template>
