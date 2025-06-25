<template>
    <div class="bg-background rounded-lg shadow-sm border border-border p-2 max-h-[200px] min-w-[140px] overflow-y-auto flex flex-col items-start justify-start gap-1">

      <template v-if="isSearching">
        <div class="flex items-center justify-center w-full h-full">
          <Icon name="tabler:loader-2 text-muted-foreground" class="w-6 h-6 animate-spin" />
        </div>
      </template>
      <template v-else-if="items.length">
        <button class="px-2 py-1 rounded-md hover:bg-muted w-full text-left" :class="{ 'bg-muted': index === selectedIndex }"
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(index)"
        >
          {{ item }}
        </button>
      </template>
      <div v-else class="item">
        No result
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  const props = defineProps<{
    query: string
    command: (id: string) => void
  }>()

  const isSearching = ref(true)
  const selectedIndex = ref(0)
  const items = ref([])

  const selectItem = (index: number) => {
    props.command(items.value[index])
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      upHandler()
    } else if (event.key === 'ArrowDown') {
      downHandler()
    } else if (event.key === 'Enter') {
      selectItem(selectedIndex.value)
    }
  }

  const upHandler = () => {
    selectedIndex.value = ((selectedIndex.value + items.value.length) - 1) % items.value.length
  }

  const downHandler = () => {
    selectedIndex.value = (selectedIndex.value + 1) % items.value.length
  }

  const enterHandler = () => {
    selectItem(selectedIndex.value)
  }

  watch(() => props.query, (newQuery) => {
    isSearching.value = true
    setTimeout(() => {
      isSearching.value = false;
    }, 1000);
  })


  </script>
  
  <style lang="scss">
  /* Dropdown menu */
  .dropdown-menu {
    background: var(--white);
    border: 1px solid var(--gray-1);
    border-radius: 0.7rem;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    overflow: auto;
    padding: 0.4rem;
    position: relative;
  
    button {
      align-items: center;
      background-color: transparent;
      display: flex;
      gap: 0.25rem;
      text-align: left;
      width: 100%;
  
      &:hover,
      &:hover.is-selected {
        background-color: var(--gray-3);
      }
  
      &.is-selected {
        background-color: var(--gray-2);
      }
    }
  }
  </style>