export const TAG_ADD_PROVIDE_KEY = Symbol('tagAddProvide');

export interface Tab {
    label: string;
    key: string;
}

export interface TagAddProvideState {
    tabs: Tab[];
    activeTab: Ref<Tab>;
}

export const useTagAddProvide = (state: TagAddProvideState) => {
    provide(TAG_ADD_PROVIDE_KEY, state);
}

export const useTagAddInject = () => {
    const state = inject<TagAddProvideState>(TAG_ADD_PROVIDE_KEY);
    if (!state) {
        throw new Error('TagAddProvideState is not provided');
    }
    return state;
}