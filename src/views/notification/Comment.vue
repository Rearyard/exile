<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <List>
    <ListItem class="ul-row" v-for="r in comments" :key="r">
      <div>
        <div style="display: flex">
          <Avatar :src="r.by.user_avatar_url" size="large"/>
          <div style="margin-left: 1em">
            <router-link :to="`/selfmobile/${r.by.id}/info`">{{r.by.user_nickname}}</router-link>
            <span style="color:gray">{{r.type=='comment'?'回复':'评论'}}了你的{{type2txt[r.type]}}</span>
            <router-link :to="r.target.link">{{r.target.content}}</router-link>
          </div>
        </div>
        <div style="margin:.5em;padding: 1em;background: #eee">
          {{r.content}}
        </div>
      </div>
      <div class="times-ago">{{moment(r.time).fromNow()}}</div>
    </ListItem>
  </List>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import moment from "moment";

  const CommentTargetType = new class {
    article = '文章'
    comment = '评论'
  }

  interface CommentEvent {
    type: keyof typeof CommentTargetType;
    content: string;
    by: { id: number; user_nickname: string; user_avatar_url: string };
    target: {
      id: number;
      content: string;
      link: string;
    };
    time: string;
  }

  @Component
  export default class MessageLike extends Vue {
    moment = moment
    type2txt = CommentTargetType
    comments: CommentEvent[] = [{
      type: 'article',
      content: '啊太太写的太好了催更催更',
      by: {
        id: 5367,
        user_nickname: "m_sevensama",
        user_avatar_url: 'http://rearyard.oss-cn-beijing.aliyuncs.com/avatar/saqaqihq98f.png?x-oss-process=style/avatar'
      },
      target: {
        id: 5367,
        content: '【哨兵向导】Wolves',
        link: '/article/99'
      },
      time: "2020-06-03T12:32:54.000Z"
    },{
      type: 'comment',
      content: '感谢喜欢！',
      by: {
        id: 5367,
        user_nickname: "m_sevensama",
        user_avatar_url: 'http://rearyard.oss-cn-beijing.aliyuncs.com/avatar/saqaqihq98f.png?x-oss-process=style/avatar'
      },
      target: {
        id: 5367,
        content: '超喜欢太太的作品',
        link: '/article/99'
      },
      time: "2020-06-03T12:32:54.000Z"
    },]
  }
</script>

<style lang="less">
  .ul-row {
    background: white;
    padding: 1em !important;


    & > .times-ago {
      display: block;
      width: 100%;
      font-size: small;
      text-align: right;
    }
  }

</style>
