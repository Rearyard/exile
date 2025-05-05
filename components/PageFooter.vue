<script setup lang="ts">
</script>

<template>
<footer class="h-[--ui-footer-height] absolute bottom-0 left-0 w-full bg-background">
  <div class="w-full h-full relative">
    <Separator label="Rearyard" class="absolute top-0" />
    <div class="w-full h-full px-6 container mx-auto flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Copyright © {{ new Date().getFullYear() }} Rearyard. All rights reserved.
      </div>
    </div>
  </div>
</footer>
</template>

<style scoped>

</style>
