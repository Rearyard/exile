<template>
  <div class="dark"></div>
  <ClientOnly>
    <Toaster />
    <ConfirmProvider />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import '~/assets/css/base.css'
import { Toaster } from "~/components/ui/sonner";

const colorMode = useColorMode()
const userStore = useUserStore();
await userStore.syncUser();
console.log(colorMode.value)
console.log(userStore.user)
useHead({
  script: [
    {
      src: 'https://static.geetest.com/v4/gt4.js',
    }
  ]
})
</script>
