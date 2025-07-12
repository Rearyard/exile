<template>
  <ModalBase v-model="isShowing" title="新建随笔" :close-on-click-outside="false">
    <template #cancel>
      <span class="cursor-pointer" @click="hide">取消</span>
    </template>
    <template #action>
      <div class="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" size="icon">
              <Icon class="w-6 h-6" name="tabler:books" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>改为创建作品</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" size="icon">
              <Icon class="w-6 h-6" name="tabler:dots-circle-horizontal" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>高级设置</TooltipContent>
        </Tooltip>
      </div>
    </template>
    <EditorPostEntry ref="editor" />
    <div class="flex items-center gap-2 flex-wrap">
      <EditorPostImageUpload v-for="file in imageFiles" :key="file.name" :file="file" />
      <div class="w-16 h-16 bg-foreground/10 rounded-lg cursor-pointer flex items-center justify-center mt-2"
        @click="handleSelectImage">
        <input type="file" class="hidden" ref="imageInput" @change="handleImageSelected" accept="image/*" />
        <Icon class="w-6 h-6 text-foreground/50" name="tabler:photo-plus" />
      </div>
    </div>
    <div v-auto-animate class="flex items-center gap-2 mt-2">
      <div v-for="tag in tags" :key="tag.id"
        class="text-sm text-foreground/50 bg-foreground/10 px-4 py-1 pr-2 rounded-full hover:bg-foreground/20 flex items-center gap-1">
        <span v-html="tag.name"></span>
        <Icon name="tabler:x" class="w-4 h-4 cursor-pointer" @click="removeTag(tag)" />
      </div>
      <button @click="openTagAdd"
        class="text-sm text-foreground/50 bg-foreground/10 px-4 py-1 rounded-full hover:bg-foreground/20 flex items-center gap-1">
        <Icon class="w-4 h-4" name="tabler:hash" />
        添加标签
      </button>
    </div>
    <div class="flex items-center justify-between gap-2 mt-6 mb-1">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon class="w-4 h-4" name="tabler:eye" />
        所有人都可见
      </div>
      <Button @click="createPost">发 布</Button>
    </div>
  </ModalBase>
  <ModalTagAddEntry ref="tagAdd" @tags-change="handleTagsChange" />
</template>

<script lang="ts" setup>
// @ts-ignore
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import type { ModalTagAddEntry, EditorPostEntry, ModalTagSearch } from '#components';
import type { Tag } from '~/components/modal/tagAdd/index'; 

const isLoading = ref(false);
const isShowing = ref(false);
const tagSearch = ref<InstanceType<typeof ModalTagSearch> | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);
const imageFiles = ref<File[]>([]);
const tagAdd = ref<InstanceType<typeof ModalTagAddEntry> | null>(null);
const editor = ref<InstanceType<typeof EditorPostEntry> | null>(null);
const tags = ref<Tag[]>([]);

function resetState() {
  isLoading.value = false;
  isShowing.value = false;
  imageFiles.value = [];
  tags.value = [];
}

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

function createPost() {
  isLoading.value = true;
  const json = editor.value?.getJSON();
  const plainContent = editor.value?.getPlainContent();
  $fetch('/api/post/create', {
    method: 'POST',
    body: {
      title: '随笔',
      content: json,
      plainContent,
      tags: tags.value,
    },
  }).then((res) => {
    resetState();
    isShowing.value = false;
  }).catch((err) => {
    console.error(err);
  }).finally(() => {
    isLoading.value = false;
  })
}

defineExpose({
  show,
  hide
})

function openTagAdd() {
  tagAdd.value?.show({
    tags: tags.value,
  });
}

function handleSelectImage() {
  imageInput.value?.click();
}

function handleImageSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFiles.value.push(file);
  }
  // 清空 input 的值
  imageInput.value!.value = '';
}

function handleTagsChange(newTags: Tag[]) {
  tags.value = newTags;
}

function removeTag(tag: Tag) {
  tags.value = tags.value.filter((t) => t.id !== tag.id);
}
</script>

<style></style>