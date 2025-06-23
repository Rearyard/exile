<template>
  <ModalBase v-model="isShowing" title="添加标签" :close-on-click-outside="false">
    <template #cancel>
      <span class="cursor-pointer" @click="hide">取消</span>
    </template>
    <div class="flex flex-col gap-4">
      <ModalTagAddTabs />
      <ModalTagAddAlert />
      <ModalTagAddContentFandom v-if="activeTab.key === 'fandom'" />
    </div>
  </ModalBase>
</template>

<script lang="ts" setup>
import { useTagAddProvide } from './index';
const isShowing = ref(false);

const tabs = [
  {
    label: '原作',
    key: 'fandom'
  },
  {
    label: '人物',
    key: 'character'
  },
  {
    label: 'CP',
    key: 'cp'
  },
  {
    label: '其他',
    key: 'tag'
  },
]

const activeTab = ref(tabs[0]);

useTagAddProvide({
  tabs,
  activeTab
})

function show() {
  isShowing.value = true;
}

function hide() {
  isShowing.value = false;
}

defineExpose({
  show,
  hide
})
</script>

<style>

</style>