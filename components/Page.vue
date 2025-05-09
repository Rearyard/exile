<script setup lang="ts">
</script>

<template>
<!-- <main class="relative pt-[--ui-header-height] pb-[--ui-footer-height] min-h-screen min-w-screen">
  <PageHeader />
  <slot />
  <PageFooter />
</main> -->
<main>
  <PageSideToolbar />
  <PageContent>
    <slot />
  </PageContent>
</main>
</template>

<style scoped>

</style>
