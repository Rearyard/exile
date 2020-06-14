<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <div>
    <List>
      <ListItem v-for="r in rows"
                @click.native="$router.push('/message/'+r.type)"
                style="display: flex;padding:1em;background-color:#fff;cursor: pointer">
        <Icon :type="r.icon" color="white" :size="40"/>
        <span style="margin: 1em">{{r.title}}</span>
        <span class="cnt-info">{{r.cnt>0?r.cnt:''}}</span>
        <div class="flex-space"/>
        <Icon type="ios-arrow-forward" :size="16"/>
      </ListItem>
    </List>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component
  export default class MessageIndex extends Vue {
    rows = [
      {type: 'notification', cnt: 2147483647, title: '系统通知', icon: 'ios-notifications-outline'},
      {type: 'directMsg', cnt: 3, title: '私信', icon: 'ios-mail-outline'},
      {type: 'comment', cnt: 0, title: '评论', icon: 'ios-chatboxes-outline'},
      {type: 'like', cnt: 12, title: '赞', icon: 'ios-thumbs-up-outline'},
    ]

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
</style>
