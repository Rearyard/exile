<template>
  <div
    class="h-full min-h-[480px] w-[76px] fixed top-0 left-0 flex flex-col items-center backdrop:blur-sm bg-[#0a0a0ad9]">
    <div class="py-4">
      <div class="w-9 h-9 bg-foreground/10 rounded">
        <PageLogo :size="36" />
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-1 items-center justify-center">
      <motion.div v-for="item in sideToolbarItem" :key="item.key" class="w-[60px] h-[60px]" while-hover="hover"
        initial="initial" animate="initial" @click="handleClick(item.key)">
        <Tooltip class="w-full h-full">
          <TooltipTrigger as-child class="w-full h-full">
            <div class=" w-full h-full py-1">
              <div class="w-full h-full flex items-center justify-center relative">
                <motion.div class="absolute w-full h-full bg-foreground/10 rounded" :variants="sideToolbarItemBg">
                </motion.div>
                <Icon class="w-[26px] h-[26px] text-foreground/50" :name="item.icon" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{{ item.tooltip }}</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </div>
    <Popover>
      <PopoverTrigger as-child>
        <motion.div class="my-4 relative" while-hover="hover" initial="initial" animate="initial">
          <div class="absolute w-full h-full py-1">
            <motion.div class="w-full h-full bg-foreground/10 rounded" :variants="sideToolbarItemBg"></motion.div>
          </div>
          <div class="w-[60px] h-[60px] flex items-center justify-center">
            <Icon class="w-[26px] h-[26px] text-foreground/50" name="tabler:settings" />
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent side="top" class="rounded-xl p-2 bg-foreground/5">
        <div>
          <div v-for="item in popoverContent" :key="item.key">
            <div class="flex items-center gap-2 cursor-pointer hover:bg-foreground/10 px-3 py-3 rounded-xl">
              <p>{{ item.label }}</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
  <ModalPost ref="modalPost" />
</template>

<script lang="ts" setup>
import type { ModalPost } from "#components";
import { motion } from "motion-v"

const sideToolbarItemBg = {
  initial: { scale: 0.9, opacity: 0 },
  hover: { scale: 1, opacity: 1 }
}

const sideToolbarItem = [
  {
    key: "home",
    icon: "tabler:home",
    href: "/",
    tooltip: "Home"
  },
  {
    key: "search",
    icon: "tabler:search",
    href: "/search",
    tooltip: "Search"
  },
  {
    key: "add",
    icon: "tabler:plus",
    href: "/add",
    tooltip: "Add"
  },
  {
    key: "likes",
    icon: "tabler:heart",
    href: "/likes",
    tooltip: "Likes"
  },
  {
    key: "user",
    icon: "tabler:user",
    href: "/user",
    tooltip: "User"
  }
]

const popoverContent = [
  {
    key: "settings",
    label: "设置",
  },
  {
    key: "logout",
    label: "登出",
  }
]

const modalPost = ref<InstanceType<typeof ModalPost> | null>(null);

function handleClick(key: string) {
  if (key === "add") {
    modalPost.value?.show();
  }
}
</script>

<style></style>