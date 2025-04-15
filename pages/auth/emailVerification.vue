<script setup lang="ts">

definePageMeta({
  layout: 'plain'
})

const route = useRoute()
const otp = ref([])
const routeUid = computed(() => {
  return String(route.query.uid);
})


const {data: emailVerificationData, error: emailVerificationDataErr} = await useFetch('/api/auth/emailVerification/info', {
  query: {
    uid: routeUid.value
  }
})

function handleComplete(value) {
  $fetch('/api/auth/emailVerification/submit', {
    method: 'POST',
    body: {
      uid: routeUid.value,
      code: Number(value.join(''))
    }
  }).then(res => {
    console.log(res)
  })
}

onMounted(() => {
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
  <div>
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>We have send a email to your register email {{ emailVerificationData.email }}, please click the link, or enter otp.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">OTP</Label>
              <PinInput
                  id="pin-input"
                  v-model="otp"
                  placeholder="○"
                  @complete="handleComplete"
              >
                <PinInputGroup>
                  <PinInputInput
                      v-for="(id, index) in 6"
                      :key="id"
                      :index="index"
                  />
                </PinInputGroup>
              </PinInput>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="framework">Framework</Label>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline">
          Cancel
        </Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>

</style>
