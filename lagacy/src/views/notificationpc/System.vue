<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <div>
    <List>
      <ListItem class="ul-row" v-for="r in notification" :key="r._id">
        <Icon type="ios-notifications-outline" size="40"></Icon>
        <div style="margin:.5em;padding: 1em; width: 100%">{{r.payload.msg}}
        </div>
        <div class="times-ago">{{moment(r.timeStamp).fromNow()}}</div>
      </ListItem>
    </List>
  </div>
</template>

<script lang="ts">
  /* eslint-disable */
  import {Component, Vue} from "vue-property-decorator";
  import moment from "moment";

  class Message {
    sender: {
      id: number,
      nickname: string,
      avatar: string
    }
    payload: {
      message: string,
      meta: string,
    }
    target: {
      id: number
      type: string
      content: string
    }
    _id: string
    timeStamp: number
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
      (this as any).$axios.get("/message/system")
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
    jumpNotification(){
      this.$router.push("/notification");
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
      width: 40%;
      font-size: small;
      text-align: right;
    }
  }
</style>
