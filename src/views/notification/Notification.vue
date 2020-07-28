<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <List>
    <ListItem class="ul-row" v-for="r in notification.message" :key="r._id">
      <div class="content">{{r.payload.msg}}
      </div>
      <div class="times-ago">{{moment(r.timeStamp).fromNow()}}</div>
    </ListItem>
    <Divider />
    <Page style="float:right; padding-right:1rem;" :current="2" :total="50" simple />
  </List>
</template>

<script lang="ts">
  /* eslint-disable */
  import {Component, Vue} from "vue-property-decorator";
  import moment from "moment";

  class Line {
    _id: string
    id: number
    name: string
  }

  class Message {
    sender: {
      id: number,
      nickname: string,
      avatar: string
    }
    payload: {
      meta: {
        cp: Line[]
        fandom: Line[]
        tag: Line[]
      }
      msg: string
    }
    target: {
      id: number
      type: string
      content: string
    }
    _id: string
    timeStamp: Date
    _ACK: boolean
    _IP: string
    _UA: string
    _v: number
  }

  class Notification {
    amount: number
    message: Message[]
  }

  @Component
  export default class MessageNotification extends Vue {
    moment = moment
    notification : Notification[] = []
    /* notifications = new Array(10).fill({
      content: '系统消息：尊敬的后花园用户，您好！根据相关法律法规和社区管理规定嘟噜噜噜噜噜。',
      time: "2020-06-03T12:32:54.000Z"
    }) */
    getNotification() {
      (this as any).$Spin.show();
      (this as any).$axios.get("/message/post")
      .then( res => {
        if(res.status == 200){
          this.notification = res.data;
          // console.log('message:', this.notification)
        }
        (this as any).$Spin.hide();
      }).catch(error=>{
        (this as any).$Spin.hide();
      });
    }
    async mounted(){
      this.getNotification()
    }
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
