<template>
  <div class="w-full flex justify-center px-5">
    <div class="min-h-screen flex">
      <div class="max-w-[640px] w-[640px] bg-foreground/5 border-x-[0.5px]">
        <div class="sticky top-0 z-10 bg-background">
          <div class="h-[--ui-header-height]"></div>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>