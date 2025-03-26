<template>
  <div class="dark"></div>
  <ClientOnly>
    <Toaster />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { Toaster} from "~/components/ui/sonner";

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
