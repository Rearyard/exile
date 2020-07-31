<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <div>
    <div style="padding-bottom:0.5rem; margin-top:0.5rem">
      <Icon type="md-arrow-back"/>
      <span @click="jumpNotification()">全部消息</span>
    </div>
    <List id="commentMessageBox">
      <ListItem class="ul-row" v-for="r in commentMessage.message" :key="r._id">
        <div style="width:100%; padding-right:1rem;">
          <div style="display: flex; flex-direction: row; width:100%">
            <Avatar :src="r.sender.avatar" size="large"/>
            <div style="margin-left: 1em; width:80%">
              <router-link :to="`/selfmobile/${r.sender.id}/info`">{{r.sender.nickname}}</router-link>
              <span style="color:gray">{{r.target.type=='comment'?'回复':'评论'}}了你的{{r.target.type=='comment'?'回复':'文章'}}</span>
              <router-link :to="`/article/${r.target.id}`">{{r.target.content}}</router-link>
            </div>
            <Icon
              v-if="!r._ACK"
              type="ios-radio-button-on"
              style="color:#ed4014"
              size="12"
            />
          </div>
          <div style="margin:.5em;padding: 1em;background: #eee; width: 100%">
            {{r.payload.message}}
          </div>
        </div>
        <div class="times-ago">{{moment(r.timeStamp).fromNow()}}</div>
      </ListItem>
    </List>
    <Page
      v-if="commentMessage.amount>10"
      style="float:right; padding-right:1rem; padding-top:0.5rem;"
      :current.sync="currentPage"
      :total="commentMessage.amount"
      simple
      @on-change="changePage"
    />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import moment from "moment";

  const CommentTargetType = new class {
    article = '文章'
    comment = '评论'
  }

  enum commentMessageType {
    "article", "comment"
  }

  class CommentEvent {
    sender: {
      id: number;
      nickname: string;
      avatar: string;
    }
    payload: {
      meta: string;
      message: string;
    }
    target: {
      id: number;
      type: commentMessageType;
      content: string;
    }
    _id: string
    timeStamp: number
    _ACK: boolean
    _IP: string
    _UA: string
    _v: number
  }

  class CommentMessage {
    amount: number
    message: CommentEvent[]
  }

  @Component
  export default class MessageLike extends Vue {
    moment = moment
    type2txt = CommentTargetType
    commentMessage: CommentMessage = {
      amount: 0,
      message: []
    }
    currentPage = 1
    getCommentMessage(offset, amount) {
      (this as any).$Spin.show();
      (this as any).$axios.get(`/message/comment?offset=${offset}&amount=${amount}`)
      .then( res => {
        if(res.status == 200){
          this.commentMessage = res.data;
          // console.log('message:', this.notification)
        }
        (this as any).$Spin.hide();
      }).catch(error=>{
        (this as any).$Spin.hide();
      });
    }
    jumpNotification(){
      this.$router.push("/notification");
    }
    changePage(pageCount){
      this.getCommentMessage((pageCount - 1) * 10, 10);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    async mounted(){
      this.getCommentMessage(0,10);
      moment.locale('zh-ch')
    }
    async beforeDestroy(){
      (this as any).$Spin.show();
      (this as any).$axios.get(`/message/comment/check`).then(
        ()=>{
          (this as any).$Spin.hide();
        }
      );
    }
  }
</script>

<style lang="less">
  #commentMessageBox .ul-row {
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
