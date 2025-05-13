<template>
  <ModalBase v-model="isShowing" title="添加标签" :close-on-click-outside="false">
    <div class="h-[350px] flex flex-col">
      <Tabs :tabs="tabs" @change="tabChange" />
      <div class="mt-4 w-full relative">
        <Input v-model="search" :placeholder="searchPlaceholder" />
        <Transition name="zoom">
          <div class="absolute top-0 right-3 h-full flex items-center justify-center" v-if="searchLoading">
            <Icon name="tabler:loader-2" class="animate-spin" />
          </div>
        </Transition>
      </div>
      <div class="mt-4 flex gap-2 flex-1 ">
        <div class="flex-1">
          <div class="w-full h-full border rounded-md border-dashed border-divider"></div>
        </div>
        <div class="flex-1">
          <div class="w-full h-full border rounded-md border-divider"></div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script lang="ts" setup>
const isShowing = ref(false);

onKeyStroke('Escape', () => {
  hide();
})

function show() {
  isShowing.value = true;
}

function hide() {
  const confirm = useConfirm({
    title: '确定退出？',
    description: '当前未发布的随笔内容将不会保存',
    onConfirm: () => {
      isShowing.value = false;
    }
  });
  confirm.show();
}

defineExpose({
  show,
  hide
})

const tabs = ref([
  {
    label: '原作',
    key: 'original'
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
    key: 'other'
  },
])
const activeTab = ref(tabs.value[0]);
function tabChange(tab: { label: string, key: string }) {
  activeTab.value = tab;
}
const searchLoading = ref(false);
const search = ref('');
const searchPlaceholder = computed(() => {
  let placeholder = '搜索';
  if (activeTab.value.key === 'original') {
    placeholder += '原作';
  } else if (activeTab.value.key === 'character') {
    placeholder += '人物';
  } else if (activeTab.value.key === 'cp') {
    placeholder += 'CP';
  } else if (activeTab.value.key === 'other') {
    placeholder += '其他';
  }
  return placeholder + '...';
})

</script>

<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
  opacity: 1;
  transform: scale(1);
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>