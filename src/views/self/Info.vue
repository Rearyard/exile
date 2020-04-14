<template>
  <div>
    <Row style="margin-bottom:2em">
      <iCol span="6">
        <div class="wrapper-avatar">
          <Badge text="Lv.1">
            <div class="center">
              <div class="outside">WELCOM<span>E</span></div>
            </div>
          </Badge>
        </div>
      </iCol>
      <iCol span="10" offset="2">
        <Button type="success" size="large"  shape="circle">更改头像</Button>
        <Row type="flex" justify="space-around" align="middle" class="wrapper-count">
          <iCol span="6" class="count-item">
            <span class="count">{{user.myFollowed}} </span>粉丝 
          </iCol>
          <Divider type="vertical" />
          <iCol span="6" class="count-item">
            <span class="count">{{user.myFollowing}}</span>关注
          </iCol>
          <Divider type="vertical" />
          <iCol span="6" class="count-item">
            <span class="count">0</span>创作
          </iCol>
        </Row>
        <p class="description">{{user.user_signature}}</p>
      </iCol>
    </Row>
    <Row class='info-row'>
      <iCol span="12">昵称</iCol>
      <iCol span="12">{{user.user_nickname}}</iCol>
    </Row>
    <Divider />
    <Row class='info-row'>
      <iCol span="12">用户名</iCol>
      <iCol span="12">{{user.user_login}}</iCol>
    </Row>
    <Divider />
    <Row class='info-row'>
      <iCol span="12">邮箱</iCol>
      <iCol span="12">{{user.user_email}}</iCol>
    </Row>
    <Divider />
    <Row class='info-row'>
      <iCol span="12">注册日期</iCol>
      <iCol span="12">{{user.user_registered}}</iCol>
    </Row>
    <Divider />
  </div>
</template>

<script>
export default {
  data(){
    return {
      user:{},
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    getUserInfo() {
      this.$axios.get(`/api/user/${this.$route.params.uid}`).then(res => {
        console.log(res);
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.user = res.data;
          } else if (res.status == 403){
            this.jumpLogin();
          } else {
            this.$Message.warning({
                content: '网络出现了一些问题，请刷新重试',
                duration: 10,
                closable: true
            });
          }
        }
      });
    }
  }
};
</script>

<style lang='less'>
@box-bg: #d8d8d8;
@box-shadow-big: 0px 10px 15px 12px rgba(208, 208, 208, 0.5);
@box-shadow-small: 0px 0px 15px 5px rgba(208, 208, 208, 0.2);
@border-radius: 18px;

// 右边
.wrapper-avatar {
  width: 100%;
}
.wrapper-avatar img {
  width: 100%;
  border-radius: 200px;
}
.wrapper-count {
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
  margin: 1em 0 1em 0;
}
.count {
  margin: 0 10px 0 0;
}
.description {
  color: #9e9e9e;
  font-size: 0.8em;
}
.info-row{
  font-size: 1.3em;
}
.img {
  width: 174px;
  height: 174px;
  border-radius: 50%;
  background: #999;
  margin-right: 1rem;
}
.grade {
  padding: 0 0.5rem;
  height: 20px;
  background: #ffc300;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  margin-right: 1rem;
}
// 更改头像
.changeImg {
  width: 8rem;
  height: 2.4rem;
  background: rgba(157, 209, 169, 1);
  font-size: 1.2rem;
  color: #fff;
  text-align: center;
  line-height: 2.4rem;
  border-radius: @border-radius;
  font-weight: bold;
  margin-bottom: 10px;
}
// 粉丝-创作-关注
.atte-box {
  display: flex;
  line-height: 2;
  p {
    border-right: 1px solid #999;
    padding-right: 1rem;
  }
  span {
    font-weight: bold;
    margin: 0 1rem;
  }
}
// 个人介绍
.bottom-top {
  p {
    line-height: 3;
    border-bottom: 1px solid #ddd;
    font-size: 1.2rem;
    display: flex;
  }
  span {
    width: 15rem;
  }
}
</style>