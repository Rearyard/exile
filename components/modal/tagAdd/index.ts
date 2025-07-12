import { TagType } from '~/types/enums/Tag';

export const TAG_ADD_PROVIDE_KEY = Symbol('tagAddProvide');

export interface Tag {
    id: string;
    name: string;
    type: TagType;
}
export interface Tab {
    label: string;
    key: string;
}

export interface TagAddProvideState {
    tabs: Tab[];
    activeTab: Ref<Tab>;
    search: Ref<string>;
    tags: Ref<Tag[]>;
    isLoading: Ref<boolean>;
    addTag: (tag: Tag) => void;
    removeTag: (tag: Tag) => void;
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