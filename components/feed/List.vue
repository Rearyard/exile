<template>
  <div>
    <FeedItem v-for="item in feedList" :key="item.id" :item="item" />
  </div>
</template>

<script lang="ts" setup>
import { faker } from '@faker-js/faker';

interface FeedItem {
  id: string
  title: string
  description: string
}
const feedList = ref<FeedItem[]>([])

const getFakeFeed = () => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
  }
}

function fetchMoreFeed() {
  feedList.value.push(...new Array(10).fill(null).map(getFakeFeed))
}

onMounted(() => {
  fetchMoreFeed()
})
</script>

<style>

</style>