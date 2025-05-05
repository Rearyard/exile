<script lang="ts" setup>
import {Toaster} from '~/components/ui/sonner';
</script>

<template>
  <div class="dark"/>
  <ClientOnly>
    <Toaster/>
    <ConfirmProvider/>
  </ClientOnly>
  <HcaptchaProvider>
    <TooltipProvider>
      <NuxtLayout>
        <slot/>
      </NuxtLayout>
    </TooltipProvider>
  </HcaptchaProvider>
</template>

<style scoped>

</style>
