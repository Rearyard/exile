<template>
  <div>
    <Row class="info-row">
      <iCol span="8">旧密码</iCol>
      <iCol span="10">
        <iInput v-model="newPassword" placeholder="无需修改则留空"></iInput>
      </iCol>
    </Row>
    <Divider />
    <Row class="info-row">
      <iCol span="8">旧密码</iCol>
      <iCol span="10">
        <iInput v-model="newPassword" placeholder="无需修改则留空"></iInput>
      </iCol>
    </Row>
    <Divider />
    <Row class="info-row">
      <iCol span="8">新密码</iCol>
      <iCol span="10">
        <iInput v-model="newPassword" placeholder="无需修改则留空"></iInput>
      </iCol>
    </Row>
    <Divider />
    <Row class="info-row">
      <iCol span="4">赞赏</iCol>
      <iCol span="6">
        <iSwitch size="large">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </iSwitch>
      </iCol>
      <iCol span="5">
        <Upload
          type="drag"
          style="display: inline-block;width:120px;"
          action="//jsonplaceholder.typicode.com/posts/"
          :show-upload-list="false"
        >
          <div style="width: 120px;height:120px;line-height: 120px;">
            <Icon type="ios-camera" size="40"></Icon>
          </div>
        </Upload>
      </iCol>
      <iCol span="6">
        <p style="font-size: 0.7em;color: gray;">
          文件大小建议在2M以下
          <br />收款码将在您开启赞赏功能后
          由赞赏按钮展示
        </p>
      </iCol>
    </Row>
    <div class="btn">
      <Button type='success' size='large' shape="circle">提交</Button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickname: "",
      newPassword: "",
      donateSwitch: true
    };
  },
  methods: {
    change(status) {
      this.$Message.info("开关状态：" + status);
    }
  }
};
</script>

<style lang='less'>
// 个人介绍
.acc-info {
  .info1 {
    height: 3;
    line-height: 3;
    border-bottom: 1px solid #ddd;
    font-size: 1rem;
    display: flex;
    span {
      width: 15rem;
    }
    input {
      margin-top: 0.7rem;
    }
  }
  .info2 {
    border: 0;
    span {
      width: 8rem;
    }
    .award-img {
      display: flex;
      margin-top: 1rem;
      img {
        width: 10rem;
        height: 10rem;
        background: rgba(217, 217, 217, 1);
      }
      p {
        font-size: 0.9rem;
        line-height: 1.5;
        margin-left: 1rem;
        color: rgba(80, 80, 80, 0.62);
      }
    }
  }
}
// 提交按钮
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
  margin-right: 3rem;
}
</style>