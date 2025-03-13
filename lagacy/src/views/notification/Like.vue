<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <div>
    <div style="padding-bottom:0.5rem; margin-top:0.5rem">
      <Icon type="md-arrow-back"/>
      <span @click="jumpNotification()">全部消息</span>
    </div>
    <List id="likeMessageBox">
      <ListItem class="ul-row" v-for="r in likeMessage.message" :key="r._id">
        <div style="width:100%; padding-right:1rem;">
          <div style="display: flex; flex-direction: row; width:100%">
            <Avatar :src="r.sender.avatar" size="large"/>
            <div class="content" style="margin-left: 1em; width:80%">
              <router-link :to="`/selfmobile/${r.sender.id}/info`">{{r.sender.nickname}}</router-link>
              <span style="color:gray">点赞了你的{{type2txt[r.target.type]}}</span>
              <router-link :to="`/article/${r.target.id}`">{{r.target.content}}</router-link>
            </div>
            <Icon
              v-if="!r._ACK"
              type="ios-radio-button-on"
              style="color:#ed4014"
              size="12"
            />
          </div>
        </div>
        <div class="times-ago">{{moment(r.timeStamp).fromNow()}}</div>
      </ListItem>
    </List>
    <Page
      v-if="likeMessage.amount>10"
      style="float:right; padding-right:1rem; padding-top:0.5rem;"
      :current.sync="currentPage"
      :total="likeMessage.amount"
      @on-change="changePage"
      simple
    />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import moment from "moment";

  const LikeTargetType = new class {
    article = '文章'
    comment = '评论'
  }

  enum likeMessageType {
    "article", "comment"
  }

  class LikeEvent {
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
      type: likeMessageType;
      content: string;
    }
    _id: string
    timeStamp: number
    _ACK: boolean
    _IP: string
    _UA: string
    _v: number
  }

  class LikeMessage {
    amount: number
      message: LikeEvent[]
  }

  @Component
  export default class MessageLike extends Vue {
    currentPage =1
    moment = moment
    type2txt = LikeTargetType
    likeMessage: LikeMessage = {
      amount: 0,
      message: []
    }
    getLikeMessage(offset, amount) {
      (this as any).$Spin.show();
      (this as any).$axios.get(`/message/like?offset=${offset}&amount=${amount}`)
      .then( res => {
        if(res.status == 200){
          this.likeMessage = res.data;
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
      this.getLikeMessage((pageCount - 1) * 10, 10);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    async mounted(){
      this.getLikeMessage(0,10);
      // console.log('mounted')
    }
    async beforeDestroy(){
      (this as any).$Spin.show();
      (this as any).$axios.get(`/message/like/check`).then(
        ()=>{
          (this as any).$Spin.hide();
        }
      );
    }
  }
</script>

<style lang="less" scoped>
  #likeMessageBox .ul-row {
    background: white;
    padding: 1em !important;
    & .content {
      margin-left: 1em !important;
    }
    & > .times-ago {
      display: block;
      width: 100%;
      font-size: small;
      text-align: right;
    }
  }
</style>
