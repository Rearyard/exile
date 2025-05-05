const provideSymbol = Symbol('useWorkEditorMetaSheet');

interface UseWorkEditorMetaSheet {
  isShowing: Ref<boolean>;
  show: () => void;
  hide: () => void;
}

export const useProvideWorkEditorMetaSheet = () => {
  const isShowing = ref(false);

  const show = () => {
    isShowing.value = true;
  };

  const hide = () => {
    isShowing.value = false;
  };
  provide<UseWorkEditorMetaSheet>(provideSymbol, { isShowing, hide, show });
}

export const useWorkEditorMetaSheet = () => {
  const workEditorMetaSheet = inject<UseWorkEditorMetaSheet>(provideSymbol);
  if (!workEditorMetaSheet) {
    throw new Error('useWorkEditorMetaSheet must be used within a provider');
  }
  return workEditorMetaSheet;
}
