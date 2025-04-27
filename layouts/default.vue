<script setup lang="ts">
const userStore = useUserStore();

const supabase = useSupabaseClient();

const signOut = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <div>
    <nav class="h-16 bg-background shadow-sm border-b">
      <div class="h-full px-6 flex mx-auto justify-between items-center container">
        <div class="flex items-center gap-x-4">
          <div class="w-8 h-8 bg-secondary rounded-md"></div>
          <div class="flex items-center gap-x-1">
            <Button variant="ghost" class="font-bold">Rearyard</Button>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-x-2">
            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button variant="ghost" @click="signOut">Sign Out</Button>
          </div>
        </div>
      </div>
    </nav>
    <slot />
  </div>
</template>

<style scoped>

</style>