<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <div>

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component
  export default class MessageDirectMsg extends Vue {
    by: {
      id: 5367;
      user_nickname: "m_sevensama";
      user_avatar_url: 'http://rearyard.oss-cn-beijing.aliyuncs.com/avatar/saqaqihq98f.png?x-oss-process=style/avatar';
    }
    contents: ['您好！', '我超喜欢太太的作品！', '写的超棒的！', '感谢喜欢！', '我会继续更新的x']
    directions: [1, 1, 1, 0, 0]
  }
</script>

<style scoped>

</style>
