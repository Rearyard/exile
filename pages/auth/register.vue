<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
// @ts-ignore
import { vAutoAnimate } from '@formkit/auto-animate/vue'

definePageMeta({
  layout: 'plain'
})

const { t } = useI18n();
const confirm = usePortableConfirm();
const hcaptcha = useHcaptcha();
const supabase = useSupabaseClient()

const router = useRouter();

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
}))

const { errors, handleSubmit, isFieldDirty, isSubmitting} = useForm({
  validationSchema: formSchema,
})


const onSubmit = handleSubmit(async (values) => {
  const { response: captchaResponse, key } = await hcaptcha.execute()
  console.log(captchaResponse, key)
  const authRes = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      captchaToken: captchaResponse,
    }
  }).then((res) => {
    console.log(res);
    if (res?.data?.user && res?.data?.session) {
      navigateTo('/')
    }
    if (res?.data?.user && !res?.data?.session) {
      // need email verification
      navigateTo({
        path: '/auth/emailVerification',
        query: {
          uid: res.data.user.id,
        }
      })
    }
    if (res.error) {
      switch (res.error.code) {
        default: {
          toast.error(t(`login.authError.${res.error.code}`))
        }
      }
    }
    throw new Error('Unknown sign up error')
  }).catch((err) => {
    toast.error(t(`login.authError.${err.code}`))
    console.log(err)
  })

  console.log(authRes);

})

onMounted(() => {
})
</script>

<template>
  <div class="w-full min-h-screen lg:grid lg:grid-cols-2">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            {{ $t('register') }}
          </h1>
          <p class="text-balance text-muted-foreground">
            {{ $t('registerPage.registerDesc')}}
          </p>
        </div>
        <form class="grid gap-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email" :validate-on-change="!!errors.email"
            :validate-on-model-update="!!errors.email" :validate-on-input="!!errors.email"
            :validate-on-blur="isFieldDirty('email')">
            <FormItem v-auto-animate data-cy="email-form-item">
              <FormLabel>{{ $t('email') }}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password" :validate-on-change="!!errors.password"
            :validate-on-model-update="!!errors.password" :validate-on-input="!!errors.password"
            :validate-on-blur="isFieldDirty('password')">
            <FormItem v-auto-animate data-cy="password-form-item">
              <FormLabel class="flex items-center">
                {{ $t('password') }}
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" name="tabler:loader-2" />
            {{ $t('registerPage.submitRequest') }}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          {{ $t('alreadyHaveAccount') }}
          <NuxtLink to="/login" class="underline">
            {{ $t('directToLogin') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block border-l bg-tile" />
  </div>
</template>

<style scoped>
.bg-tile {
  background-image: url("~/assets/images/tile.png");
  background-repeat: repeat;
  background-size: 400px 400px;
}
</style>
