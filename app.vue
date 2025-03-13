<template>
  <div class="dark"></div>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">

const colorMode = useColorMode()
console.log(colorMode.value)
</script>
