<script setup lang="ts">
// @ts-ignore
import { vAutoAnimate } from '@formkit/auto-animate/vue'
definePageMeta({
  layout: 'plain'
})

const supabase = useSupabaseClient()
const route = useRoute()
const otp = ref([])
const routeUid = computed(() => {
  return String(route.query.uid);
})


const {data: emailVerificationData, error: emailVerificationDataErr, refresh} = await useFetch('/api/auth/emailVerification/info', {
  query: {
    uid: routeUid.value
  }
})

const isValidating = ref(false);
const isOtpError = ref(false)

function handleChange() {
  isOtpError.value = false;
}

function handleComplete(value: string[]) {
  isValidating.value = true;
  supabase.auth.verifyOtp({
    type: 'email',
    token: value.join(''),
    email: emailVerificationData.value?.email || '',
  }).then(res => {
    if (res.error) {
      isOtpError.value = true
    } else {
      console.log(res);
      navigateTo('/')
    }
  }).catch(error => {
    console.log(error);
    isOtpError.value = true;
  }).finally(() => {
    isValidating.value = false;
  })
}

function handleResend() {
  return supabase.auth.resend({
    type: 'signup',
    email: emailVerificationData.value?.email || '',
  }).then((res) => {
    console.log(res);
  })
}

onMounted(() => {
  refresh();
  // $fetch('/api/auth/emailVerification/send', {
  //   method: 'POST',
  //   body: {
  //     uid: routeUid.value
  //   }
  // }).then(res => {
  //   console.log(res);
  // })
})
</script>

<template>
  <div class="w-full h-full min-h-screen min-w-screen flex items-center justify-center">
    <Card class="w-[80%] max-w-[720px]">
      <CardHeader>
        <CardTitle class="text-xl text-center mb-4">{{ $t('emailVerificationPage.title') }}</CardTitle>
        <CardDescription class="leading-6">
          <I18nT keypath="emailVerificationPage.desc" tag="span">
            <span class='font-bold'>
              {{emailVerificationData?.email}}
            </span>
          </I18nT>
          <a class="underline underline-offset-4 cursor-pointer" @click="handleResend">
            {{$t('emailVerificationPage.resendEmail')}}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent class="my-8">
        <form>
          <div class="grid items-center w-full gap-4">
            <div v-auto-animate class="flex flex-col space-y-1.5 w-full items-center">
              <PinInput
                  id="pin-input"
                  class="mb-2"
                  :class="{
                    'animate-shake': isOtpError,
                    'opacity-50': isValidating,
                    'pointer-events-none': isValidating,
                    'text-red-500': isOtpError,
                  }"
                  v-model="otp"
                  placeholder="○"
                  :disabled="isValidating"
                  @complete="handleComplete"
                  @change="handleChange"
              >
                <PinInputGroup>
                  <PinInputInput
                      v-for="(id, index) in 6"
                      :key="id"
                      :index="index"
                  />
                </PinInputGroup>
              </PinInput>
              <span v-if="isOtpError" class="text-xs text-red-500">{{ $t('emailVerificationPage.validationError') }}</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.animate-shake {
  animation: shake 1s ease-in-out;
}
</style>
