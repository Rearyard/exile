<template>
    <div class="items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid w-full" :style="{
        gridTemplateColumns: `repeat(${props.tabs.length}, 1fr)`
    }">
        <div v-for="tab in props.tabs" :key="tab.key"
            :data-state="modelValue.key === tab.key ? 'active' : 'inactive'"
            :data-active="modelValue.key === tab.key"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
            <button @click="tabChange(tab)" class="w-full h-full disabled:cursor-not-allowed" :disabled="tab.disabled">
                {{ tab.label }}
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface TabItem {
    label: string;
    key: string;
    disabled?: boolean;
}
const modelValue = defineModel<TabItem>({
    required: true,
})
interface Props {
    tabs: TabItem[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'change', tab: TabItem): void;
}>();

function tabChange(tab: TabItem) {
    modelValue.value = tab;
    emit('change', tab);
}
</script>

<style scoped></style>