<template>
  <div>
    <Button>Click me</Button>
  </div>
</template>
<script setup lang="ts">

const colorMode = useColorMode()
console.log(colorMode.value)
</script>
