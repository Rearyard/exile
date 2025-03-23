<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
const baseCaptchaUrl = 'https://www.rearyard.com/api/auth/captcha'
const captchaUrl = ref(baseCaptchaUrl + '?t=' + Date.now())

definePageMeta({
  layout: 'plain'
})

const user = useSupabaseUser()

const refreshCaptcha = () => {
  captchaUrl.value = baseCaptchaUrl + '?t=' + Date.now()
}

const formSchema = toTypedSchema(z.object({
  username: z.string().email(),
  password: z.string().min(6).max(50),
}))

const captchaRef = shallowRef<Geetest | null>(null)

const { isFieldDirty, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  if (!captchaRef.value || !captchaRef.value.getValidate()) {
    return
  }
  return $fetch('/api/auth/login', {
    method: 'POST',
    body: {
      ...values,
    },
    headers: {
      ...Object.fromEntries(
        Object.entries(captchaRef.value.getValidate()!)
          .map(([key, value]) => ['x-geetest-' + key, value])
      )
    }
  })
})

onMounted(() => {
  console.log('mounted', user.value)
  window.initGeetest4({
    captchaId: '4a24a30e8df2ea2176c7fdc435d0758b',
    nativeButton: {
      height: '46px',
      width: '100%',
    }
  },function (captcha) {
    captchaRef.value = captcha
    // captcha为验证码实例
    captcha.appendTo("#captcha");// 调用appendTo将验证码插入到页的某一个元素中，这个元素用户可以自定义
  });
})
</script>

<template>
  <div class="w-full min-h-screen lg:grid lg:grid-cols-2">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            {{ $t('login') }}
          </h1>
          <p class="text-balance text-muted-foreground">
            {{ $t('loginDesc')}}
          </p>
        </div>
        <form class="grid gap-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username" :validate-on-change="!!errors.username" :validate-on-model-update="!!errors.username" :validate-on-input="!!errors.username" :validate-on-blur="isFieldDirty('username')">
            <FormItem>
              <FormLabel>{{ $t('email') }}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password" :validate-on-change="!!errors.password" :validate-on-model-update="!!errors.password" :validate-on-input="!!errors.password" :validate-on-blur="isFieldDirty('password')">
            <FormItem>
              <FormLabel class="flex items-center">
                {{ $t('password') }}
                <a href="/" class="ml-auto text-sm underline">
                  {{ $t('forgotPassword') }}
                </a>
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="captcha">
            <FormItem>
              <FormLabel>{{ $t('captcha') }}</FormLabel>
              <FormControl>
                <div id="captcha" class="h-[46px] bg-secondary rounded-md text-sm leading-[46px] text-center text-muted-foreground">
                  <span v-if="!captchaRef">验证码加载中...</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" name="tabler:loader-2" />
            {{ $t('submit') }}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          {{ $t('dontHaveAccount') }}
          <router-link to="/register" class="underline">
            {{ $t('register') }}
          </router-link>
        </div>
      </div>
    </div>
    <div  class="hidden bg-muted lg:block">
      <img
          src="https://source.unsplash.com/1920x1080/?nature"
          alt="Image"
          width="1920"
          height="1080"
          class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      >
    </div>
  </div>
</template>

<style scoped>

</style>
