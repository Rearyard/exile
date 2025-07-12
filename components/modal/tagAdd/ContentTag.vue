<template>
  <div class="h-[370px] overflow-hidden relative flex flex-col">
    <div class="absolute h-full w-full flex justify-center items-center top-0 left-0 pointer-events-none">
      <div>
        <Icon class="text-[8rem] text-foreground/10" name="tabler:hash" />
      </div>
    </div>
    <div v-auto-animate class="overflow-y-auto flex-1">
      <div v-if="search && needCreate"
        class="px-4 py-4 border-b flex items-center justify-between gap-2 cursor-pointer transition-colors"
        @click="createTag">
        <div class="flex items-center gap-2">
          <Icon class="text-foreground/50 text-xl mr-2" name="tabler:hash" />
          <div class="font-bold">{{ search }}</div>
        </div>
        <div class="text-muted-foreground">+ 创建</div>
      </div>
      <div v-for="tag in tagsList" :key="tag.id"
        class="px-4 py-3 border-b flex items-center justify-between gap-2 cursor-pointer hover:bg-foreground/5 transition-colors"
        @click="addTag({
          id: tag.id,
          name: tag.rawName,
          type: TagType.Tag,
        })">
        <div class="flex items-center gap-2">
          <Icon class="text-foreground/50 text-xl mr-2" name="tabler:hash" />
          <div class="font-bold" v-html="tag.rawName"></div>
        </div>
        <div class="text-muted-foreground">999+</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from 'vue-sonner'
// @ts-ignore
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useTagAddInject } from './index';
import { TagType } from '~/types/enums/Tag';

const { search, tags, addTag, isLoading } = useTagAddInject();
const tagsList = ref<{
  id: string;
  rawName: string;
  name: string;
  created_at?: string;
  updated_at: string;
}[]>([]);



const needCreate = computed(() => {
  return !tagsList.value.some((tag) => tag.rawName === search.value);
})


const createTag = () => {
  isLoading.value = true;
  const name = search.value;
  return $fetch('/api/tag/create', {
    method: 'POST',
    body: {
      name,
    },
  }).then((res) => {
    console.log(res);
    addTag({
      id: res.id,
      name,
      type: TagType.Tag,
    });
    search.value = '';
    tagsList.value = [];
    toast.success('创建成功')
  }).catch((err) => {
    console.log(err);
    toast.error('创建失败, 请稍后重试')
  }).finally(() => {
    isLoading.value = false;
  })
}

const searchTag = () => {
  isLoading.value = true;
  return $fetch('/api/tag/search', {
    query: {
      query: search.value,
      limit: 10,
      offset: 0,
    },
  }).then((res) => { 
    // @ts-ignore
    tagsList.value = res.hits.map((hit) => hit._formatted);
  }).finally(() => {
    isLoading.value = false;
  })
}

watch(search, (value) => {
  if (value) {
    searchTag().then((res) => {
      console.log(res);
    })
  }
}, {
  immediate: true,
})
</script>

<style></style>