<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toast } from 'vue-sonner'
const baseCaptchaUrl = 'https://www.rearyard.com/api/auth/captcha'
const captchaUrl = ref(baseCaptchaUrl + '?t=' + Date.now())

definePageMeta({
  layout: 'plain'
})

const { t } = useI18n()
const supabase = useSupabaseClient()
const userStore = useUserStore()
const hcaptcha = useHcaptcha()

const refreshCaptcha = () => {
  captchaUrl.value = baseCaptchaUrl + '?t=' + Date.now()
}

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
}))

const { isFieldDirty, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const { response, key } = await hcaptcha.execute()
  console.log(response, key)

  supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
    options: {
      captchaToken: response,
    }
  }).then((res) => {
    if (res?.data?.user && res?.data?.session) {
      console.log(userStore.user)
      navigateTo('/')
    }
    if (res.error) {
      switch (res.error.code) {
        default: {
          toast.error(t(`login.authError.${res.error.code}`))
        }
      }
    }
    console.log(res);
    
  }).catch((err) => {
    console.log(err)
  })
})
onMounted(() => {
  if (userStore.user) {
    return navigateTo('/')
  }
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
          <FormField v-slot="{ componentField }" name="email" :validate-on-change="!!errors.email"
            :validate-on-model-update="!!errors.email" :validate-on-input="!!errors.email"
            :validate-on-blur="isFieldDirty('email')">
            <FormItem>
              <FormLabel>{{ $t('email') }}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password" :validate-on-change="!!errors.password"
            :validate-on-model-update="!!errors.password" :validate-on-input="!!errors.password"
            :validate-on-blur="isFieldDirty('password')">
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
          <Button type="submit" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" name="tabler:loader-2" />
            {{ $t('submit') }}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          {{ $t('dontHaveAccount') }}
          <router-link to="/auth/register" class="underline">
            {{ $t('register') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img src="https://source.unsplash.com/1920x1080/?nature" alt="Image" width="1920" height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
    </div>
  </div>
</template>

<style scoped>

</style>
