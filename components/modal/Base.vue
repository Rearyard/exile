<template>
  <Body :style="bodyStyle" />
  <Teleport to="body">
    <Transition name="modal">
      <div class="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm" v-show="isShowing">
        <div class="absolute inset-0" @click="closeOnClickOutside ? hide() : null"></div>
        <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-1/2 max-w-[700px] min-w-[600px] border rounded-xl bg-background modal-wrapper">
          <div class="h-[50px] px-5 py-3 relative border-b flex items-center justify-between">
            <div class="absolute top-0 left-5">
              <div class="h-[50px] flex justify-center items-center">
                <slot name="cancel">
                  <span>取消</span>
                </slot>
              </div>
            </div>
            <div class="flex w-full items-center justify-center gap-2">
              <div class="font-medium">
                <slot name="title">
                  <span>{{ props.title }}</span>
                </slot>
              </div>
            </div>
            <div class="absolute top-0 right-5">
              <div class="h-[53px] flex justify-center items-center">
                <slot name="action" />
              </div>
            </div>
          </div>
          <div class="px-5 py-3">
            <slot />
          </div>
        </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  closeOnClickOutside?: boolean;
  title?: string;
}>(), {
  closeOnClickOutside: true,
  title: 'Title'
});

const isShowing = defineModel<boolean>({
  required: false,
  default: false
});

const bodyStyle = computed(() => {
  return isShowing.value ? {
    overflow: 'hidden',
    pointerEvents: 'none'
  } : {};
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
.modal-enter-active,
.modal-leave-active {
  transition: all .3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-wrapper {
  transition: all .3s ease;
  transition-delay: .2s;
}

.modal-enter-from,
.modal-leave-to .modal-wrapper {
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from .modal-wrapper {
  transform: scale(1);
}
</style>