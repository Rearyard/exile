<template>
  <div class="border rounded-lg mb-2 text-sm">
    <div class="px-4 py-2 border-b">
      <input type="text" class="w-full border-none outline-none bg-transparent" v-model="search" placeholder="搜索原作" />
    </div>
    <div class="h-[400px] overflow-hidden relative flex flex-col">
      <div class="absolute h-full w-full flex justify-center items-center top-0 left-0 pointer-events-none">
        <div>
          <Icon class="text-[8rem] text-foreground/10" name="tabler:book-2" />
        </div>
      </div>
      <div v-auto-animate class="overflow-y-auto flex-1">
        <div v-if="search" class="px-4 py-4 border-b flex items-center gap-2 cursor-pointer transition-colors">
          <Icon class="text-foreground/50 text-xl mr-2" name="tabler:book-2" />
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 mb-2 font-bold"># {{search}}</div>
            <div class="text-foreground/50">
              <span class="font-bold w-[3em] inline-block">人物：</span>#人物，#人物，#人物
            </div>
            <div class="text-foreground/50">
              <span class="font-bold w-[3em] inline-block">CP：</span>#标签，#标签，#标签
            </div>
          </div>
          <Popover :open="isShowingCreateFandom" @update:open="isShowingCreateFandom = $event">
            <PopoverTrigger class="ml-auto">
              <Button size="sm" variant="outline">
                <Icon name="tabler:plus" />
                创建
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div class="flex flex-col gap-2">
                <h4 class="text-[1.02rem] font-bold">创建原作</h4>
                <div class="grid gap-2">
                  <div class="grid grid-cols-3 items-center gap-4">
                    <Label for="width">原作类型</Label>
                    <Select v-model="createFandomForm.type">
                      <SelectTrigger class="col-span-2">
                        <SelectValue placeholder="请选择原作类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="item in availableFandomsCategories" :key="item.value" :value="item.value">
                            {{ item.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="grid grid-cols-3 items-center gap-4">
                    <Label for="maxWidth">是 RPS</Label>
                    <div class="col-span-2 h-8 flex items-center">
                      <Switch v-model="createFandomForm.isRps" class="ml-auto" />
                    </div>
                  </div>
                  <div class="grid grid-cols-3 items-center gap-4">
                    <Label for="height">是你的原创</Label>
                    <div class="col-span-2 h-8 flex items-center">
                      <Switch v-model="createFandomForm.isOriginal" class="ml-auto" />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2">
                    <Button size="sm" variant="outline" @click="isShowingCreateFandom = false">取消</Button>
                    <Button size="sm" :loading="isCreating" :disabled="!isCreateFandomValid"
                      @click="createFandom">提交</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div v-for="index in 10" :key="index"
          class="px-4 py-4 border-b flex items-center gap-2 cursor-pointer hover:bg-foreground/5 transition-colors">
          <Icon class="text-foreground/50 text-xl mr-2" name="tabler:book-2" />
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 mb-2 font-bold"># 原作 <Badge>官方</Badge>
              <Badge>RPS</Badge>
            </div>
            <div class="text-foreground/50">
              <span class="font-bold w-[3em] inline-block">人物：</span>#人物，#人物，#人物
            </div>
            <div class="text-foreground/50">
              <span class="font-bold w-[3em] inline-block">CP：</span>#标签，#标签，#标签
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from 'vue-sonner'
// @ts-ignore
import { vAutoAnimate } from '@formkit/auto-animate/vue'
const search = ref('');
const isCreating = ref(false);
const isShowingCreateFandom = ref(false);
const availableFandomsCategories = ref([
  {
    name: '小说',
    value: 'novel',
  },
  {
    name: '漫画',
    value: 'comic',
  },
  {
    name: '动画',
    value: 'anime',
  },
  {
    name: '游戏',
    value: 'game',
  },
  {
    name: '电影',
    value: 'movie',
  },
  {
    name: '其他',
    value: 'other',
  },
]);

watch(isShowingCreateFandom, (value) => {
  if (!value) {
    createFandomForm.value = {
      type: '',
      isRps: false,
      isOriginal: false,
    }
  }
})

const createFandomForm = ref({
  type: '',
  isRps: false,
  isOriginal: false,
})

const isCreateFandomValid = computed(() => {
  return Boolean(createFandomForm.value.type && search.value);
})

const createFandom = () => {
  isCreating.value = true;
  return $fetch('/api/fandom/create', {
    method: 'POST',
    body: {
      name: search.value,
      type: createFandomForm.value.type,
      isRps: createFandomForm.value.isRps,
      isOriginal: createFandomForm.value.isOriginal,
    },
  }).then((res) => {
    console.log(res);
    toast.success('创建成功')
    isShowingCreateFandom.value = false;
  }).catch((err) => {
    console.log(err);
    toast.error('创建失败, 请稍后重试')
  }).finally(() => {
    isCreating.value = false;
  })
}

const searchFandom = () => {
  return $fetch('/api/fandom/search', {
    query: {
      q: search.value,
      limit: 10,
      offset: 0,
    },
  })
}

watch(search, (value) => {
  if (value) {
    searchFandom().then((res) => {
      console.log(res);
    })
  }
}, {
  immediate: true,
})
</script>

<style></style>