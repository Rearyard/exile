<template>
  <slot />
  <vue-hcaptcha ref="captchaRef" sitekey="f9d87bdc-4290-4eda-bbc6-377eda90d4fc" size="invisible" />
</template>

<script lang="ts" setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
const captchaRef = shallowRef<VueHcaptcha | null>(null)
useHcaptchaProvide(captchaRef)
</script>

<style>

</style>