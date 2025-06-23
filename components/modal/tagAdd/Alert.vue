<template>
  <Alert v-if="activeTab.key === 'fandom'">
     <AlertTitle># 原作 Tag</AlertTitle>
      <AlertDescription>
        推荐先添加原作Tag，原作Tag的定义，跳转到定义解释的链接。
      </AlertDescription>
  </Alert>
  <Alert v-else-if="activeTab.key === 'character'">
    <AlertTitle># 人物 Tag</AlertTitle>
    <AlertDescription>
      推荐先添加人物Tag，人物Tag的定义，跳转到定义解释的链接。
    </AlertDescription>
  </Alert>
  <Alert v-else-if="activeTab.key === 'cp'">
    <AlertTitle># CP Tag</AlertTitle>
    <AlertDescription>
      推荐先添加CP Tag，CP Tag的定义，跳转到定义解释的链接。
    </AlertDescription>
  </Alert>
  <Alert v-else-if="activeTab.key === 'tag'">
    <AlertTitle># 其他 Tag</AlertTitle>
    <AlertDescription>
      推荐先添加其他Tag，其他Tag的定义，跳转到定义解释的链接。
    </AlertDescription>
  </Alert>
  <div v-else class="hidden"></div>
</template>

<script lang="ts" setup>
import { useTagAddInject } from './index';

const { activeTab } = useTagAddInject();
</script>

<style>

</style>