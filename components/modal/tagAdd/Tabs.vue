<template>
  <Tabs :tabs="tabs" @change="tabChange" />
</template>

<script lang="ts" setup>
import { useTagAddInject, type Tab } from './index';

const { tabs, activeTab } = useTagAddInject();

function tabChange(tab: Tab) {
  activeTab.value = tab;
}
</script>

<style>

</style>