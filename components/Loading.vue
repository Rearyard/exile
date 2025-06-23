<template>
  <div class="relative">
    <div v-bind="$attrs" class="w-full h-full" :class="{ 'opacity-50': loading }">
      <slot />
    </div>
    <div v-if="loading" class="absolute inset-0 flex flex-col gap-2 items-center justify-center cursor-wait">
      <Icon name="tabler:loader-2 text-muted-foreground" class="w-6 h-6 animate-spin" />
      <span class="text-sm text-muted-foreground">
        <slot name="loading-text" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  loading?: boolean;
}

const props = defineProps<Props>();
</script>

<style>

</style>