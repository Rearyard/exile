<template>
  <div>
    <FeedItem v-for="item in feedList" :key="item.id" :title="item.title" :auther="item.auther"
      :createdAt="humanizeTime(item.createdAt)" :content="item.content.plain_text" :tags="item.content.tags"
      :likeCount="item.content.likes" :commentCount="item.content.comments" :shareCount="item.content.shares" />
  </div>
</template>

<script lang="ts" setup>
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import type { PostFeedItem } from '~/types/feed';
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const feedList = ref<PostFeedItem[]>([])

function humanizeTime(time: string) {
  return dayjs(time).fromNow()
}



function fetchMoreFeed() {
  return $fetch('/api/feed/list').then((res) => {
    feedList.value = res.data
  })
}

onMounted(() => {
  fetchMoreFeed()
})
</script>

<style>

</style>