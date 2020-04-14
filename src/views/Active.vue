<template>
  <div>
    <Spin size="large" fix v-if="loading"></Spin>
    <Modal v-model="modal" title="激活你的账号" :mask-closable="false" :closable="false">
      <p>您的账号需要激活</p>
      <p>为了验证您的邮箱可用，我们需要验证您的邮箱：</p>
      <Row type="flex" justify="center">
        <iCol>
          <Button :disabled="disabled" type="primary" @click="sendMail">发送激活邮件 {{timer}}</Button>
        </iCol>
      </Row>
      <div slot="footer">
        <Button type="success" size="large" long>我已激活，返回主页</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import cookie from "js-cookie";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      icon: require("@/assets/favicon_green.png"),
      modal: true,
      timer: null,
      disabled: false,
      loading:false,
    };
  },
  methods: {
    setTempCookie() {
      if (cookie.get("temp")) {
        return;
      }
      const date = new Date();
      date.setTime(date.getTime() + 60 * 1000);
      cookie.set("temp", true, { expires: date });
      console.log(cookie.get("temp"));
      return;
    },
    checkTempcookie() {
      return cookie.get("temp");
    },
    setTimer() {
      let time = 60;
      this.disabled = true;
      const timer = setInterval(() => {
        this.timer = `(${time})`;
        time--;
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        this.timer = null;
        this.disabled = false;
      }, 61000);
    },
    sendMail() {
      this.setTimer();
      if (this.checkTempcookie()) {
        return;
      }
      this.setTempCookie();
      const csrfToken = cookie.get("csrfToken");
      this.$axios.post("/api/auth/activemail",{}, {
        headers: { "x-csrf-token": csrfToken },
        withCredentials: true
      }).then((res)=>{
        console.log(res)
      })
    },
    postActive(){
      const csrfToken = cookie.get("csrfToken");
      this.$axios.get(`/api/auth/active?code=${this.$route.query.code}`).then((res)=>{
        this.$store.commit("clearUserInfo");
        this.$Message.info('请重新登陆');
        this.$router.push('/login')
      })
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.modal = false;
      this.loading = true;
      this.postActive();
    }else{
      return;
    }
  }
};
</script>

<style scoped>
input {
  text-align: center;
}
#page {
  min-height: 100vh;
}
#mainCard {
  margin-top: 20vh;
}
#icon {
  box-shadow: 0px 0px 7px #00000042;
  margin-top: -70px;
}
#login-form {
  margin-top: 20px;
}
#footer {
  text-align: center;
}
#captcha {
  height: 33px;
  /*position: absolute;*/
  /*right: 0;*/
  /*border: 1px solid #dcdee2;*/
  /*border-radius: 3px;*/
}
</style>
