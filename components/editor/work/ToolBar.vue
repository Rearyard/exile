<script setup lang="ts">
const sheet = useWorkEditorMetaSheet();
function showSheet() {
  return sheet.show();
}
</script>

<template>
<div class="border-b px-2 flex items-center gap-1 h-[--ui-editor-work-toolbar-height]">
  <div class="flex-1" />
  <EditorWorkToolbarItemHeading />
  <EditorWorkToolbarItemBlockQuote />
  <EditorWorkToolbarItemBold />
  <EditorWorkToolbarItemItalic />
  <EditorWorkToolbarItemStrike />
  <EditorWorkToolbarItemSeprator />
  <EditorWorkToolbarItemTextAligns />
  <a @click="showSheet">show</a>
  <div class="flex-1" />
  <EditorWorkMetaSheet />
</div>
</template>

<style scoped>

</style>
