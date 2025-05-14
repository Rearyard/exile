<template>
  <ModalBase v-model="isShowing" title="添加标签" :close-on-click-outside="false">
    <template #cancel>
      <span class="cursor-pointer" @click="hide">取消</span>
    </template>
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
      <div class="mt-4 flex gap-2 flex-1 overflow-hidden">
        <div class="flex-1">
          <div
            class="w-full h-full border rounded-md border-dashed border-divider p-2 flex flex-wrap gap-2 content-start overflow-hidden overflow-y-auto after:flex-1 text-sm">
            <div v-for="(tag, index) in tags" :key="tag"
              class="bg-foreground/10 rounded-md py-1 px-2 h-fit grow text-center hover:bg-foreground/20 transition-all duration-200 cursor-pointer"
              @click="addTag(tag)">
              {{ tag }}
            </div>
            <div v-if="search"
              class="bg-foreground/10 rounded-md py-1 px-2 h-fit text-center hover:bg-foreground/20 transition-all duration-200 cursor-pointer">
              <div class="flex items-center justify-center gap-2">
                <Icon name="tabler:plus" />
                <div class="flex-1">{{ search }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div
            class="w-full h-full border rounded-md border-divider p-2 flex flex-wrap gap-2 content-start overflow-hidden overflow-y-auto after:flex-1 text-sm">
            <div layout v-for="(tag, index) in tagsSelected" :key="tag"
              class="bg-orange-200/10 rounded-md p-1 h-fit grow text-center flex items-center justify-between gap-2">
              <div class="flex-1">{{ tag }}</div>
              <div
                class="cursor-pointer p-1 flex bg-transparent hover:bg-red-500/20 hover:text-red-500 transition-all duration-200 rounded-md"
                @click="removeSelectedTag(tag)">
                <Icon name="tabler:x" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script lang="ts" setup>
import { motion, LayoutGroup } from 'motion-v';
import { faker } from '@faker-js/faker';
const isShowing = ref(false);

onKeyStroke('Escape', () => {
  hide();
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
const tags = ref<string[]>([]);
const tagsSelected = ref<string[]>([]);
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
function shuffleTags() {
  // random 3-10 tags with faker
  tags.value = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, () => faker.lorem.word());
}

function addTag(tag: string) {
  tagsSelected.value.push(tag);
  tags.value = tags.value.filter(t => t !== tag);
}

function removeSelectedTag(tag: string) {
  tagsSelected.value = tagsSelected.value.filter(t => t !== tag);
}

watch(activeTab, (val) => {
  search.value = '';
})

watch(search, (val) => {
  if (val.length > 0) {
    shuffleTags();
  } else {
    tags.value = [];
  }
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