<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";
import {Textarea} from "~/components/ui/textarea";

definePageMeta({
  layout: 'plain'
})

const baseCaptchaUrl = 'https://www.rearyard.com/api/auth/captcha'
const captchaUrl = ref(baseCaptchaUrl + '?t=' + Date.now())

const refreshCaptcha = () => {
  captchaUrl.value = baseCaptchaUrl + '?t=' + Date.now()
}

const questionsText = '请尽可能详尽的填写下列问题的回答,回答的越详尽真实越有可能通过申请。（每一题答案至少超过25字）您也可以在回答完毕所有问题后加上自己想说的话。同时请不要删除题目以方便志愿者审核。审核通过后,邀请链接将发送到您的邮箱，届时请注意查收。\n' +
    '1. 您想在后花园阅读/创作什么类型或哪方面的同人？请举例。\n' +
    '2.请谈谈对您来说印象比较深刻的一篇或多篇同人及为何打动你，若遗忘作品名/作者名请务必对作品内容进行详细描述。\n' +
    '3.请聊聊您最初是如何接触到了同人文化的。'

const formSchema = toTypedSchema(z.object({
  username: z.string().email(),
  password: z.string().min(140).max(3000).default(questionsText),
  captcha: z.string().min(4).max(4),
}))

const { isFieldDirty, errors, handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
})


const onSubmit = handleSubmit((values) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(values)
      resolve(0)
    }, 5000)
  })
})

onMounted(() => {
  setFieldValue('password', questionsText)
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
        <Alert>
          <AlertTitle class="mb-2">{{ $t('registerPage.headsUp') }}</AlertTitle>
          <AlertDescription>
            {{ $t('registerPage.alertContent') }}
          </AlertDescription>
        </Alert>
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
                <Textarea v-bind="componentField" class="min-h-[280px]"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="captcha" :validate-on-change="!!errors.captcha" :validate-on-model-update="!!errors.captcha" :validate-on-input="!!errors.captcha" :validate-on-blur="isFieldDirty('captcha')">
            <FormItem>
              <FormLabel>{{ $t('captcha') }}</FormLabel>
              <FormControl>
                <div class="flex items-center h-9">
                  <Input type="text" placeholder="" v-bind="componentField" />
                  <NuxtImg class="bg-secondary h-full rounded-md ml-2" :src="captchaUrl" alt="Captcha" @click="refreshCaptcha" />
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
<!--        <div class="grid gap-4">-->
<!--          <div class="grid gap-2">-->
<!--            <Label for="email">{{ $t('email') }}</Label>-->
<!--            <Input-->
<!--                id="email"-->
<!--                type="email"-->
<!--                placeholder="m@example.com"-->
<!--                required-->
<!--            />-->
<!--          </div>-->
<!--          <div class="grid gap-2">-->
<!--            <div class="flex items-center">-->
<!--              <Label for="password">{{ $t('password') }}</Label>-->
<!--              <a-->
<!--                  href="/forgot-password"-->
<!--                  class="ml-auto inline-block text-sm underline"-->
<!--              >-->
<!--                {{ $t('forgotPassword') }}-->
<!--              </a>-->
<!--            </div>-->
<!--            <Input id="password" type="password" required />-->
<!--          </div>-->
<!--          <div class="grid gap-2">-->
<!--            <div class="flex items-center">-->
<!--              <Label for="password">{{ $t('captcha') }}</Label>-->
<!--            </div>-->
<!--            <div class="flex items-center">-->
<!--              <Input id="captcha" type="text" required  />-->
<!--              <NuxtImg class="bg-secondary h-full rounded-md ml-2" :src="captchaUrl" alt="Captcha" @click="refreshCaptcha" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <Button type="submit" class="w-full">-->
<!--            {{ $t('login') }}-->
<!--          </Button>-->
<!--          <Button variant="outline" class="w-full">-->
<!--            Login with Google-->
<!--          </Button>-->
<!--        </div>-->
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