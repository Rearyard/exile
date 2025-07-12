<template>
  <ModalBase v-model="isShowing" title="添加标签" :close-on-click-outside="false">
    <template #cancel>
      <span class="cursor-pointer" @click="hide">取消</span>
    </template>
    <div class="flex flex-col gap-4">
      <ModalTagAddTabs />
      <ModalTagAddAlert />
      <ModalTagAddDisplay />
      <div class="border rounded-lg mb-2 text-sm">
        <div class="px-4 py-2 border-b flex items-center gap-2 relative">
          <!-- <div v-for="tag in tags" :key="tag.id" class="text-sm shrink-0">
            <Badge variant="closeable" @close="removeTag(tag)">
              {{ tag.name }}
            </Badge>
          </div> -->
          <input type="text" class="w-full border-none outline-none bg-transparent" v-model="search"
            :placeholder="`搜索 ${activeTab.display}`" />
          <Transition name="fade">
            <div v-if="isLoading" class="absolute right-2 top-0 bottom-0 flex items-center gap-2 text-muted-foreground">
              <Icon name="tabler:loader-2" class="w-4 h-4 animate-spin" />
            </div>
          </Transition>
        </div>
        <ModalTagAddContentTag v-if="activeTab.key === 'tag'" />
      </div>
      <!-- <ModalTagAddContentFandom v-if=" activeTab.key==='fandom'" />
      -->
    </div>
    <template #action>
      <span class=" cursor-pointer" @click="handleDone">完成</span>
    </template>
  </ModalBase>
</template>

<script lang="ts" setup>
import { useTagAddProvide } from './index';
import type { Tag } from './index';
const isShowing = ref(false);

const search = ref('');
const isLoading = ref(false);
const tags = ref<Tag[]>([]);
const tabs = [
  {
    label: '原作',
    display: '原作',
    key: 'fandom',
    disabled: true,
  },
  {
    label: '人物',
    display: '人物',
    key: 'character',
    disabled: true,
  },
  {
    label: 'CP',
    display: ' CP',
    key: 'cp',
    disabled: true,
  },
  {
    label: '其他',
    display: ' Tag',
    key: 'tag'
  },
]

const emit = defineEmits<{
  (e: 'tags-change', tags: Tag[]): void
}>()

const activeTab = ref(tabs[3]);
function addTag(tag: Tag) {
  // 如果tags中已经存在，则不添加
  if (tags.value.some((t) => t.id === tag.id && t.type === tag.type)) {
    return;
  }
  tags.value.push(tag);
}
function removeTag(tag: Tag) {
  tags.value = tags.value.filter((t) => !(t.id === tag.id && t.type === tag.type));
}
useTagAddProvide({
  tabs,
  activeTab,
  search,
  tags,
  addTag,
  removeTag,
  isLoading,
})

function show({ tags: initialTags }: { tags?: Tag[] }) {
  tags.value = initialTags || [];
  isShowing.value = true;
}

function hide() {
  isShowing.value = false;
}

function handleDone() {
  emit('tags-change', tags.value);
  hide();
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>