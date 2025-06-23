<template>
  <div class="w-full flex justify-center px-5 bg-neutral-50 dark:bg-background">
    <div class="min-h-screen">
      <div class="max-w-[640px] w-[640px] flex flex-col">
        <div class="sticky top-0 z-10 bg-neutral-50 dark:bg-background">
          <div class="h-[60px]">
            <div class="w-full h-full flex items-center justify-center">
              <div class="font-medium">首页</div>
            </div>
          </div>
          <div class="w-9 h-9 absolute left-[-12px] top-[48px] overflow-hidden bg-neutral-50 dark:bg-background">
            <div class="w-12 h-12 absolute left-3 top-3 bg-background dark:bg-foreground/5 left-corner"></div>
          </div>
          <div class="w-[calc(100%-46px)] h-3 top-12 left-6 absolute border-b-[0.5px]"></div>
          <div class="w-9 h-9 absolute right-[-12px] top-[48px] overflow-hidden bg-neutral-50 dark:bg-background">
            <div class="w-12 h-12 absolute right-3 top-3 bg-background dark:bg-foreground/5 right-corner"></div>
          </div>
        </div>
        <main class="bg-background dark:bg-foreground/5 min-h-[calc(100vh-60px)] border-x-[0.5px] pt-1">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
.left-corner {
  border-top-style: solid;
  border-top-width: 0.5px;
  border-left-style: solid;
  border-left-width: 0.5px;
  border-top-left-radius: 24px;
}

.right-corner {
  border-top-style: solid;
  border-top-width: 0.5px;
  border-right-style: solid;
  border-right-width: 0.5px;
  border-top-right-radius: 24px;
}
</style>