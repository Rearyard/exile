<template>
  <div class="dark"></div>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">

const colorMode = useColorMode()
console.log(colorMode.value)

useHead({
  script: [
    {
      src: 'https://static.geetest.com/v4/gt4.js',
    }
  ]
})
</script>
