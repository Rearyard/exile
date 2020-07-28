<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <div>
    <List>
      <ListItem v-for="r in rows" :key="r.type"
                @click.native="$router.push('/notification/'+r.type)"
                style="display: flex;padding:1em;background-color:#fff;cursor: pointer">
        <Icon :type="r.icon" color="white" :size="40"/>
        <span style="margin: 1em">{{r.title}}</span>
        <div class="flex-space"/>
        <span class="cnt-info">{{r.cnt>0?r.cnt:''}}</span>
        <Icon type="ios-arrow-forward" :size="16"/>
      </ListItem>
      <ListItem v-for="r in directMsgs" :key="r.by.id"
                @click.native="$router.push('/notification/directMsg/'+r.by.id)"
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
  <!-- <div>
    <List>
      <ListItem @click.native="$router.push('/message/notification')"
                style="display: flex;padding:1em;background-color:#fff;cursor: pointer">
        <Icon type="ios-notifications-outline" color="white" :size="40"/>
        <span style="margin: 1em">通知</span>
        <div class="flex-space"/>
        <span class="cnt-info">{{message.posts>0?message.posts:''}}</span>
        <Icon type="ios-arrow-forward" :size="16"/>
      </ListItem>
      <ListItem @click.native="$router.push('/message/comment')"
                style="display: flex;padding:1em;background-color:#fff;cursor: pointer">
        <Icon type="ios-chatboxes-outline" color="white" :size="40"/>
        <span style="margin: 1em">评论</span>
        <div class="flex-space"/>
        <span class="cnt-info">{{message.comments>0?message.comments:''}}</span>
        <Icon type="ios-arrow-forward" :size="16"/>
      </ListItem>
      <ListItem @click.native="$router.push('/message/like')"
                style="display: flex;padding:1em;background-color:#fff;cursor: pointer">
        <Icon type="ios-thumbs-up-outline" color="white" :size="40"/>
        <span style="margin: 1em">点赞</span>
        <div class="flex-space"/>
        <span class="cnt-info">{{message.likes>0?message.likes:''}}</span>
        <Icon type="ios-arrow-forward" :size="16"/>
      </ListItem>
    </List> 
  </div> -->
</template>

<script lang="ts">
  /*eslint-disable*/
  import {Component, Vue} from "vue-property-decorator";
  import Axios from "axios";
  import router from "../../router";

  @Component
  export default class MessageIndex extends Vue {
    rows = [
      {type: 'system', title: '关注', cnt: 0, icon: 'ios-notifications-outline'},
      // {type: 'directMsg', cnt: 3, title: '私信', icon: 'ios-mail-outline'},
      {type: 'comment', title: '评论', cnt:0 ,icon: 'ios-chatboxes-outline'},
      {type: 'like', title: '赞', cnt:0 ,icon: 'ios-thumbs-up-outline'},
    ]
    directMsgs = []
    message = {
      likes: 0,
      posts: 0,
      comments: 0
    }

    async mounted() {
      this.getMessage();
    }

    getMessage() {
      (this as any).$Spin.show();
      (this as any).$axios.get("/message/all").then( res => {
        if(res.status == 200){
          this.message = res.data;
          // console.log('message:', this.message)
          this.rows[0].cnt = this.message.posts;
          this.rows[1].cnt = this.message.comments;
          this.rows[2].cnt = this.message.likes;
        }
        (this as any).$Spin.hide();
      }).catch(error=>{
        (this as any).$Spin.hide();
      });
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
