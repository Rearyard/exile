<script setup lang="ts">
const state = useWorkEditorMetaSheet();
</script>

<template>
  <Sheet v-model:open="state.isShowing.value">
    <SheetContent>
      <SheetHeader>
        <SheetTitle></SheetTitle>
        <SheetDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>

<style scoped>

</style>
