<!--eslint-disable-->
<!--suppress ALL -->
<template>
  <List>
    <ListItem class="ul-row" v-for="r in notifications">
      <div class="content">{{r.content}}
      </div>
      <div class="times-ago">{{moment(r.time).fromNow()}}</div>
    </ListItem>
  </List>
</template>
<script lang="ts">
  /* eslint-disable */
  import {Component, Vue} from "vue-property-decorator";
  import moment from "moment";

  @Component
  export default class MessageNotification extends Vue {
    moment = moment
    notifications = new Array(10).fill({
      content: '系统消息：尊敬的后花园用户，您好！根据相关法律法规和社区管理规定嘟噜噜噜噜噜。',
      time: "2020-06-03T12:32:54.000Z"
    })
  }
</script>

<style lang="less">
  .ul-row {
    background: white;
    padding: 1em !important;

    & > .content {
    }

    & > .times-ago {
      display: block;
      width: 100%;
      font-size: small;
      text-align: right;
    }
  }
</style>
