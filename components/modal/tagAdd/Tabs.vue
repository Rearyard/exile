<template>
  <Tabs v-model="activeTab" :tabs="tabs"  />
</template>

<script lang="ts" setup>
import { useTagAddInject, type Tab } from './index';

const { tabs, activeTab } = useTagAddInject();

</script>

<style>

</style>