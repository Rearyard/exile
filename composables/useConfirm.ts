import i18n from '~/i18n'
export const useGlobalConfirmState = createGlobalState(() => {
  const confirmInstances = ref<IExtendendConfirmOptions[]>([]);

  function show(id: string) {
    const instance = confirmInstances.value.find(item => item.id === id)
    if (instance) {
      instance.showing = true
    }
  }

  function hide(id: string) {
    const instance = confirmInstances.value.find(item => item.id === id)
    if (instance) {
      instance.showing = false
    }
  }

  function destory(id: string) {
    const index = confirmInstances.value.findIndex(item => item.id === id)
    if (index !== -1) {
      confirmInstances.value.splice(index, 1)
    }
  }

  function destoryAll() {
    confirmInstances.value = []
  }

  function add(options: IConfirmOptions) {
    const extentdedOptions = {
      id: useId(),
      ...options,
      showing: options.defaultShowing ?? false,
    }
    confirmInstances.value.push(extentdedOptions)
    return {
      instance: extentdedOptions,
      show: () => show(extentdedOptions.id),
      hide: () => hide(extentdedOptions.id),
      destroy: () => destory(extentdedOptions.id)
    }
  }

  return {
    confirmInstances,
    add,
    hide,
    destory,
    destoryAll
  }
})

export interface IConfirmOptions {
  /**
   * Title of confirm modal
   */
  title?: string
  /**
   * Description of confirm modal
   */
  description?: string
  /**
   * Text of cancel button
   */
  cancelText?: string
  /**
   * Text of confirm button
   */
  confirmText?: string
  /**
   * Whether to show by default
   */
  defaultShowing?: boolean
  /**
   * Callback function when confirm button is clicked
   */
  onConfirm?: () => void | Promise<any>
  /**
   * Callback function when cancel button is clicked
   */
  onCancel?: () => void | Promise<any>
}

export interface IExtendendConfirmOptions extends IConfirmOptions {
  /**
   * unique id for confirm modal
   */
  id: string;

  /**
   * id confirm modal is showing
   */
  showing: boolean;
}

export const useConfirm = (options: IConfirmOptions) => {
  const state = useGlobalConfirmState();
  const {t} = i18n.global;
  return state.add({
    title: t('confirm.title'),
    description: t('confirm.description'),
    cancelText: t('confirm.cancelText'),
    confirmText: t('confirm.confirmText'),
    ...options
  })
}

export const usePortableConfirm = () => {
  return {
    show: (options: IConfirmOptions) => {
      const instance = useConfirm(options)
      instance.show()
      return instance;
    },
    hide: (id: string) => {
      const state = useGlobalConfirmState();
      state.hide(id)
    },
    destory: (id: string) => {
      const state = useGlobalConfirmState();
      state.destory(id)
    },
    destoryAll: () => {
      const state = useGlobalConfirmState();
      state.destoryAll()
    }
  }
}
