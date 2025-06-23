<template>
  <ModalBase v-model="isShowing" title="添加标签" :close-on-click-outside="false">
    <template #cancel>
      <span class="cursor-pointer" @click="hide">取消</span>
    </template>
    <Loading class="h-[450px] flex flex-col">
      <Tabs :tabs="tabs" @change="tabChange" />
      <div class="mt-4 w-full relative">
        <Alert>
          <AlertTitle>人物 Tag</AlertTitle>
          <AlertDescription>
            在添加人物Tag之前，建议先添加「原作」Tag，对应原作下的人物会优先出现在下方
          </AlertDescription>
        </Alert>
        <Input class="w-full mt-4" v-model="search" :placeholder="searchPlaceholder" />
        <Transition name="zoom">
          <div class="absolute top-0 right-3 h-full flex items-center justify-center" v-if="searchLoading">
            <Icon v-if="searchLoading" name="tabler:loader-2" class="animate-spin" />
          </div>
        </Transition>
      </div>
      <div class="mt-4 flex gap-2 flex-1 overflow-hidden">
        <div class="flex-1">
          <div
            class="w-full h-full border rounded-md border-dashed border-divider p-2 flex flex-wrap gap-2 content-start overflow-hidden overflow-y-auto after:flex-1 text-sm">
            <div v-if="showAddTag"
              class="bg-foreground/10 rounded-md py-1 px-2 h-fit text-center hover:bg-foreground/20 transition-all duration-200 cursor-pointer">
              <Popover>
                <PopoverTrigger>
                  <div class="flex items-center justify-center gap-2">
                    <Icon name="tabler:plus" />
                    <div class="flex-1">{{ search }}</div>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div class="grid gap-4">
                    <div class="space-y-2">
                      <h4 class="font-medium leading-none">
                        创建
                      </h4>
                      <p class="text-xs text-muted-foreground">
                        在创建新 Tag 之前，建议先查阅创作守则
                      </p>
                    </div>
                    <div class="grid gap-2">
                      <div class="grid grid-cols-3 items-center gap-4">
                        <Label for="width">Width</Label>
                        <Input id="width" type="text" default-value="100%" class="col-span-2 h-8" />
                      </div>
                      <div class="grid grid-cols-3 items-center gap-4">
                        <Label for="maxWidth">Max. width</Label>
                        <Input id="maxWidth" type="text" default-value="300px" class="col-span-2 h-8" />
                      </div>
                      <div class="grid grid-cols-3 items-center gap-4">
                        <Label for="height">Height</Label>
                        <Input id="height" type="text" default-value="25px" class="col-span-2 h-8" />
                      </div>
                      <div class="grid grid-cols-3 items-center gap-4">
                        <Label for="maxHeight">Max. height</Label>
                        <Input id="maxHeight" type="text" default-value="none" class="col-span-2 h-8" />
                      </div>
                    </div>
                    <div>
                      <Button @click="createTag(search)">创建</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div v-for="(tag, index) in tagSearchResult" :key="tag.id"
              class="bg-foreground/10 rounded-md py-1 px-2 h-fit grow text-center hover:bg-foreground/20 transition-all duration-200 cursor-pointer"
              @click="addTag(tag)">
              <span v-html="tag.name" />
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
    </Loading>
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
  if (activeTab.value.key === 'fandom') {
    placeholder += '原作';
  } else if (activeTab.value.key === 'character') {
    placeholder += '人物';
  } else if (activeTab.value.key === 'cp') {
    placeholder += 'CP';
  } else if (activeTab.value.key === 'tag') {
    placeholder += '其他';
  }
  return placeholder + '...';
})

interface SimpleTag {
  id: string;
  name: string;
}

const fandomSearchResult = ref<SimpleTag[]>([]);
const characterSearchResult = ref<SimpleTag[]>([]);
const cpSearchResult = ref<SimpleTag[]>([]);
const tagSearchResult = ref<SimpleTag[]>([]);

const searchResult = computed(() => {
  switch (activeTab.value.key) {
    case 'fandom':
      return fandomSearchResult.value;
    case 'character':
      return characterSearchResult.value;
    case 'cp':
      return cpSearchResult.value;
    case 'tag':
      return tagSearchResult.value;
    default:
      return [];
  }
})

const showAddTag = computed(() => {
  return search.value && !searchResult.value.some((tag) => tag.name === search.value);
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



async function searchTag() {
  searchLoading.value = true;
  const res = await $fetch('/api/tag/search', {
    method: 'GET',
    query: {
      query: search.value,
    },
  }).then(res => {
    tagSearchResult.value = res.hits?.map((hit) => {
      return {
        id: hit._formatted.id,
        name: hit.name,
      }
    });
  }).finally(() => {
    searchLoading.value = false;
  })
  console.log(res);
}

async function getTagById(id: string) {
  return $fetch(`/api/tag/${id}`, {
    method: 'GET',
  });
}

async function createTag(name: string) {
  return $fetch('/api/tag/create', {
    method: 'POST',
    body: {
      name,
    },
  }).then(async res => {
    const id = res.id;
    const tagCreated = await getTagById(id)
    console.log(tagCreated);
  });
}

const debounceSearch = useDebounceFn(searchTag, 500);

const searchFunction = computed(() => {
  switch (activeTab.value.key) {
    case 'fandom':
      return debounceSearch;
    case 'character':
      return debounceSearch;
    case 'cp':
      return debounceSearch;
    case 'tag':
      return debounceSearch;
    default:
      return () => { };
  }
})

watch(activeTab, (val) => {
  search.value = '';
})

watch(search, (val) => {
  if (val.length > 0) {
    searchFunction.value();
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

:deep(em) {
  font-style: normal;
}
</style>