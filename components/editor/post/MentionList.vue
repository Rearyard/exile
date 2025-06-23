<template>
    <div class="bg-background rounded-lg shadow-sm border border-border p-2 max-h-[200px] overflow-y-auto flex flex-col items-start justify-start gap-1">
      <template v-if="items.length">
        <button class="px-2 py-1 rounded-md hover:bg-muted w-full text-left" :class="{ 'bg-muted': index === selectedIndex }"
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(index)"
        >
          {{ item }}
        </button>
      </template>
      <div class="item" v-else>
        No result
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true,
      },
  
      command: {
        type: Function,
        required: true,
      },
    },
  
    data() {
      return {
        selectedIndex: 0,
      }
    },
  
    watch: {
      items() {
        this.selectedIndex = 0
      },
    },
  
    methods: {
      onKeyDown({ event }) {
        if (event.key === 'ArrowUp') {
          this.upHandler()
          return true
        }
  
        if (event.key === 'ArrowDown') {
          this.downHandler()
          return true
        }
  
        if (event.key === 'Enter') {
          this.enterHandler()
          return true
        }
  
        return false
      },
  
      upHandler() {
        this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
      },
  
      downHandler() {
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length
      },
  
      enterHandler() {
        this.selectItem(this.selectedIndex)
      },
  
      selectItem(index) {
        const item = this.items[index]
  
        if (item) {
          this.command({ id: item })
        }
      },
    },
  }
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