<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <div>
    <List>
      <ListItem v-for="r in rows" :key="r.type"
                @click.native="$router.push('/message/'+r.type)"
                style="display: flex;padding:1em;background-color:#fff;cursor: pointer">
        <Icon :type="r.icon" color="white" :size="40"/>
        <span style="margin: 1em">{{r.title}}</span>
        <div class="flex-space"/>
        <span class="cnt-info">{{r.cnt>0?r.cnt:''}}</span>
        <Icon type="ios-arrow-forward" :size="16"/>
      </ListItem>
      <ListItem v-for="r in directMsgs" :key="r.by.id"
                @click.native="$router.push('/message/directMsg/'+r.by.id)"
                style="display: flex;padding:1em;background-color:#fff;cursor: pointer">
        <Avatar :src="r.by.user_avatar_url" style="width: 48px;height: 48px"/>
        <div style="margin: 0em 1em">
          <div>{{r.by.user_nickname}}</div>
          <span style="text-overflow:ellipsis;color: gray">{{r.lastContent}}</span>
        </div>
        <div class="flex-space"/>
        <span class="cnt-info">{{r.cnt>0?r.cnt:''}}</span>
        <Icon type="ios-arrow-forward" :size="16"/>
      </ListItem>
    </List>
  </div>
</template>

<script lang="ts">
  /*eslint-disable*/
  import {Component, Vue} from "vue-property-decorator";

  @Component
  export default class MessageIndex extends Vue {
    rows = [
      {type: 'notification', cnt: 2147483647, title: '系统通知', icon: 'ios-notifications-outline'},
      // {type: 'directMsg', cnt: 3, title: '私信', icon: 'ios-mail-outline'},
      {type: 'comment', cnt: 0, title: '评论', icon: 'ios-chatboxes-outline'},
      {type: 'like', cnt: 12, title: '赞', icon: 'ios-thumbs-up-outline'},
    ]
    directMsgs = []

    mounted() {
    }
  }
</script>

<style>
  .ivu-icon-ios-notifications-outline {
    background: lightgray;
  }

  .ivu-icon-ios-mail-outline {
    background: lightblue;
  }

  .ivu-icon-ios-chatboxes-outline {
    background: #acdeac;
  }

  .ivu-icon-ios-thumbs-up-outline {
    background: pink;
  }

  .ivu-list-item .ivu-icon {
    padding: 4px;
    border-radius: 50%;
  }

  .flex-space {
    flex-grow: 999;
  }

  .cnt-info {
    border-radius: 1em 1em;
    background: rgba(255, 0, 0, 0.6);
    padding: 0 .5em;
    color: white;
    font-weight: bold;
  }

  .ul-row a {
    color: #222222;
    text-decoration: underline;
  }
</style>
