import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

export const useHcaptchaProvide = (captchaShallowRef: Ref<VueHcaptcha | null>) => {
  provide('captchaRef', captchaShallowRef)
} 

export const useHcaptcha = () => {
  const captchaRef = inject<Ref<VueHcaptcha | null>>('captchaRef')

  if (!captchaRef) {
    throw new Error('captchaRef is not provided')
  }

  const execute = async () => {
    if (!captchaRef.value) {
      throw new Error('captchaRef is not ready')
    }
    return captchaRef.value.executeAsync().then(({ response, key }) => {
      captchaRef.value!.reset();
      return { response, key }
    })
  }

  const reset = () => {
    if (!captchaRef.value) {
      throw new Error('captchaRef is not ready')
    }
    captchaRef.value.reset();
  }

  return { execute, reset }
}
