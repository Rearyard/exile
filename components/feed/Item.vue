<template>
  <div class="px-6 py-3 border-b-[0.5px]">
    <div class="flex items-center gap-2">
      <div class="grid grid-cols-2 gap-1 w-10 h-10 mr-2 shrink-0">
        <div class="bg-gray-200 rounded"></div>
        <div class="bg-gray-200 rounded"></div>
        <div class="bg-gray-200 rounded"></div>
        <div class="bg-gray-200 rounded"></div>
      </div>
      <div class="flex items-center gap-2 w-full">
        <Badge>Harry Potter</Badge>
        <p class="font-medium text-[1.1rem]">Harry and the Philosopher's Stone</p>
        <Button variant="ghost" size="icon" class="ml-auto">
          <Icon name="tabler:dots" />
        </Button>
      </div>
    </div>
    <div class="mt-6">
      <div class="bg-red-500/30 text-red-500 text-sm px-2 py-1 rounded-md flex items-center gap-2 mb-1">
        <Icon name="tabler:alert-square-rounded-filled" />
        May contains harmful content.
      </div>
      <p class="text-base/7 text-foreground/80 text-justify line-clamp-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
    </div>
    <div class="mt-2">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <Avatar class="w-6 h-6">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p class="text-sm font-medium">John Doe</p>
        </div>
        <p class="text-sm text-foreground/80">10 minutes ago</p>
        <div class="flex items-center gap-2 ml-auto">
          <span class="text-sm text-foreground/80 underline cursor-pointer"># HarryPotter</span>
          <span class="text-sm text-foreground/80 underline cursor-pointer"># Magic</span>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <div class="flex items-center gap-8 text-foreground/60">
        <div class="cursor-pointer flex items-center justify-center py-2 gap-2">
          <Icon class="text-xl" name="tabler:heart" /> <span class="text-sm">345</span>
        </div>
        <div class="cursor-pointer flex items-center justify-center py-2 gap-2">
          <Icon class="text-xl" name="tabler:message" /> <span class="text-sm">345</span>
        </div>
        <div class="cursor-pointer flex items-center justify-center py-2 gap-2">
          <Icon class="text-xl" name="tabler:share" /> <span class="text-sm">345</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>