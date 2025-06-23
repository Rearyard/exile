<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

interface Props {
  file: File
}

const props = defineProps<Props>()

const previewUrl = ref<string | null>(null)
const isUploading = ref(true)
const progress = ref(0)
const isUploaded = ref(false)
const isError = ref(false)

const isFileImage = computed(() => {
  return props.file.type.startsWith('image/')
})

watch(props.file, () => {
  if (props.file && isFileImage.value) {
    previewUrl.value = URL.createObjectURL(props.file)
  } else {
    previewUrl.value = null
  }
}, { immediate: true })


async function upload() {
  // fake upload
  isUploading.value = true
  progress.value = 0
  await new Promise(resolve => setTimeout(resolve, 1000))
  progress.value = 50
  await new Promise(resolve => setTimeout(resolve, 1000))
  progress.value = 100
  isUploading.value = false
  isUploaded.value = true
}

onMounted(() => {
  upload()
})
</script>

<template>
  <div class="wrapper w-16 h-16 bg-foreground/10 rounded-lg flex items-center justify-center mt-2 relative">
    <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover rounded-lg" />
    <Icon v-else-if="!isUploading" class="w-6 h-6 text-foreground/50" name="tabler:photo-plus" />
    <div v-if="isUploading" class="absolute top-0 left-0 w-full h-full rounded-lg flex items-center justify-center bg-black/30">
      <Loader2 class="w-4 h-4 animate-spin text-foreground/50" />
    </div>
    <div class="cancel-button absolute top-0 right-0 w-6 h-6 flex rounded-full bg-background dark:bg-muted items-center justify-center translate-x-1/2 -translate-y-1/2 shadow-sm z-10 transition-all duration-300 opacity-0 cursor-pointer pointer-events-none hover:shadow-md">
      <Icon class="w-4 h-4 text-red-500" name="tabler:x" />
    </div>
  </div>
</template>

<style scoped>
.wrapper:hover .cancel-button,
.wrapper:hover .cancel-button:hover {
  opacity: 1;
  pointer-events: auto;
}
</style>