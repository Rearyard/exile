<template>
  <Teleport to="body">
    <ConfirmModal style="z-index: 1000;" v-for="(item, index) in confirmInstances" :key="item.id" :instance="item" />
  </Teleport>
</template>

<script lang="ts" setup>
const confirmInstancesState = useGlobalConfirmState();
const confirmInstances = computed<IExtendendConfirmOptions[]>(() => { 
  return confirmInstancesState.confirmInstances.value as unknown as IExtendendConfirmOptions[]
})

</script>

<style>

</style>