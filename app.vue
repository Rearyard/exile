<template>
  <App>
    <NuxtPage/>
  </App>
</template>
<script lang="ts" setup>
import '~/assets/css/base.css';

const colorMode = useColorMode();
const userStore = useUserStore();

console.log(colorMode.value);
console.log(userStore.user);
useHead({
  script: [
    {
      src: 'https://static.geetest.com/v4/gt4.js',
    },
  ],
});
</script>
