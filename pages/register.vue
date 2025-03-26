<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'plain'
})

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
  inviteCode: z.string().min(6).max(50),
}))

const { errors, handleSubmit, isFieldDirty, isSubmitting} = useForm({
  validationSchema: formSchema,
})

const { captchaRef, getValidate } = useGeetest('#captcha')


const onSubmit = handleSubmit((values) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(values)
      resolve(0)
    }, 5000)
  })
})

onMounted(() => {
  setTimeout(() => {
    toast.error('This is an error message', {
      duration: Infinity,
      action: {
        label: 'Retry',
        onClick: () => {
          console.log('retry')
        }
      }
    })
  }, 0)
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
          <FormField v-slot="{ componentField }" name="email" :validate-on-change="!!errors.email" :validate-on-model-update="!!errors.email" :validate-on-input="!!errors.email" :validate-on-blur="isFieldDirty('email')">
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
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="inviteCode" :validate-on-change="!!errors.inviteCode" :validate-on-model-update="!!errors.inviteCode" :validate-on-input="!!errors.inviteCode" :validate-on-blur="isFieldDirty('inviteCode')">
            <FormItem>
              <FormLabel class="flex items-center">
                {{ $t('registerPage.inviteCode') }}
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
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
            {{ $t('registerPage.submitRequest') }}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          {{ $t('alreadyHaveAccount') }}
          <a href="#" class="underline">
            {{ $t('directToLogin') }}
          </a>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
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