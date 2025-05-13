<template>
  <Combobox v-model="modelValue" v-model:open="open" :ignore-filter="true">
    <ComboboxAnchor as-child>
      <TagsInput v-model="modelValue" class="px-2 gap-2 w-full">
        <div class="flex gap-2 flex-wrap items-center">
          <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>

        <ComboboxInput v-model="searchTerm" as-child>
          <TagsInputInput placeholder="搜索原作..." class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
            @keydown.enter.prevent />
          <Transition name="zoom">
            <div v-if="isLoading" class="flex items-center justify-center">
              <Icon class="animate-spin" name="tabler:loader-2" />
            </div>
          </Transition>
        </ComboboxInput>
      </TagsInput>

      <ComboboxList class="w-[--reka-popper-anchor-width] max-h-[250px] overflow-y-auto">
        <ComboboxEmpty />
        <ComboboxGroup>
          <ComboboxItem v-for="fandom in filteredFandoms" :key="fandom.value" :value="fandom.label"
            @select.prevent="(ev) => {
              if (typeof ev.detail.value === 'string') {
                searchTerm = ''
                modelValue.push(ev.detail.value)
              }

              if (filteredFandoms.length === 0) {
                open = false
              }
            }">
            {{ fandom.label }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>

<script lang="ts" setup>
import { faker } from '@faker-js/faker';
const isLoading = ref(false);
const modelValue = ref<string[]>([]);
const open = ref(false);
const searchTerm = ref('');
const filteredFandoms = ref<{ label: string; value: string }[]>([]);

function searchFandoms() {
  isLoading.value = true;
  filteredFandoms.value = [];
  setTimeout(() => {
    isLoading.value = false;
    // random 10 fandoms
    filteredFandoms.value = Array.from({ length: 10 }, () => ({
      label: faker.lorem.word(),
      value: faker.lorem.word(),
    }));
  }, 1000);
}

const debouncedSearchFandoms = useDebounceFn(searchFandoms, 500);

watch(searchTerm, debouncedSearchFandoms);
</script>

<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.zoom-enter-to,
.zoom-leave-from {
  opacity: 1;
  transform: scale(1);
}

</style>