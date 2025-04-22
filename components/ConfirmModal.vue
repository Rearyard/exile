<template>
  <AlertDialog :open="props.instance.showing">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ props.instance.title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.instance.description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button @click.stop="onCancel" variant="outline" :disabled="isCancelLoading">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isCancelLoading" />{{ props.instance.cancelText }}
        </Button>
        <Button @click.stop="onConfirm" :disabled="isConfirmLoading">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isConfirmLoading" />{{ props.instance.confirmText }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
import { Loader2 } from 'lucide-vue-next'
const props = defineProps<{
  instance: IExtendendConfirmOptions
}>()

const globalConfirmState = useGlobalConfirmState();

const isCancelLoading = ref(false);
const isConfirmLoading = ref(false);

async function onCancel() {
  isCancelLoading.value = true;
  try {
    await props.instance.onCancel?.()
  } catch (error) {
    console.error(error)
  } finally {
    isCancelLoading.value = false;
    globalConfirmState.hide(props.instance.id)
  }
}

async function onConfirm() {
  isConfirmLoading.value = true;
  try {
    await props.instance.onConfirm?.()
  } catch (error) {
    console.error(error)
  } finally {
    isConfirmLoading.value = false;
    globalConfirmState.hide(props.instance.id)
  }
}
</script>

<style>

</style>