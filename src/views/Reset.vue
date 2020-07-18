/* eslint-disable */
<template>
  <div>
    <Row type="flex" justify="center" align="middle" id="mainCard">
      <iCol :xs="20" :lg="6">
        <Card>
          <Row type="flex" justify="center" align="middle">
            <iCol>
              <Avatar :src="icon" size="90" id="icon" />
            </iCol>
          </Row>
          <Row>
            <iCol v-if="step==1">
              <Form ref="loginForm" :model="form" :rules="rules" id="login-form">
                <FormItem label="邮箱" prop="email">
                  <iInput
                    v-model="form.email"
                    size="large"
                    @keypress.native="$event.key==='Enter'&&handleSubmit()"
                  />
                </FormItem>
                <FormItem>
                  <div class="wait" v-if="!geetestReady">验证码加载中...</div>
                  <div v-show="geetestReady" id="gt"></div>
                </FormItem>
                <FormItem>
                  <Button type="success" :loading="loading" long @click="handlerConfirmEmail">确定</Button>
                </FormItem>
              </Form>
            </iCol>
            <iCol v-if="step==2">
              <div>
                <Form>
                  <FormItem>
                    <p>一封包含验证码的邮件已经发往你的邮箱，请保持本页面开启，并输入邮件中的验证码。</p>
                  </FormItem>
                  <FormItem>
                    <iInput v-model="emailCode">
                      <Button
                        slot="append"
                        :disabled="resend.counter!=0"
                      >重新发送{{resend.counter?`(${resend.count})`:''}}</Button>
                    </iInput>
                  </FormItem>
                  <FormItem>
                    <Button type="success" :loading="loading" long @click="handlerConfirmCode">提交</Button>
                  </FormItem>
                </Form>
              </div>
            </iCol>
            <iCol v-if="step==3">
              <Form>
                <FormItem>
                  <p>请输入新密码：</p>
                </FormItem>
                <FormItem label="新密码">
                  <iInput type="password" password v-model="newPassword" placeholder="8-22位，仅包含数字字母下划线"></iInput>
                </FormItem>
                <FormItem label="重复新密码">
                  <iInput type="password" password v-model="newPasswordConfirm" placeholder="与之前相同"></iInput>
                </FormItem>
                <FormItem>
                  <Button type="success" :loading="loading" long @click="handlerConfirmPassword">提交</Button>
                </FormItem>
              </Form>
            </iCol>
          </Row>
        </Card>
      </iCol>
    </Row>
  </div>
</template>

<script>
import cookie from "js-cookie";
import { mapMutations } from "vuex";
import "@/static/js/gt";

export default {
  data() {
    return {
      icon: require("@/assets/favicon_green.png"),
      captcha: true,
      captchaSrc: "/api/auth/captcha",
      loading: false,
      step: 1,
      form: {
        email: ""
      },
      rules: {
        email: [{ required: true, message: "邮箱不可为空", trigger: "blur" }]
      },
      emailCode: "",
      geetest: {},
      geetestReady: false,
      geetestValidate: {},
      geetestSecondValidate: false,
      captchaObj: "",
      resend: {
        count: 120,
        counter: 0
      },
      token: "",
      newPassword: "",
      newPasswordConfirm: ""
    };
  },
  mounted() {
    this.getGeetestCaptcha();
  },
  methods: {
    handlerConfirmEmail() {
      if (!this.geetestSecondValidate) {
        return this.$Message.warning("请先完成验证码或稍等服务器校验完毕");
      }
      this.loading = true;
      this.sendResetMail();
    },
    handlerConfirmCode() {
      this.$axios
        .post("/api/auth/reset/code", { code: this.emailCode })
        .then(res => {
          if (!res.data.result) {
            return this.$Message.error("验证码错误");
          }
          this.token = res.data.token;
          this.step++;
        });
    },
    handlerConfirmPassword(){
      if (!this.newPassword) {
        return this.$Message.error("密码不可为空")
      }
      if (this.newPassword!==this.newPasswordConfirm) {
        return this.$Message.error("两次输入的密码不一致，请检查")
      }
      this.$axios.post('/api/auth/reset',{password:this.newPassword,token:this.token}).then((res)=>{
        if (res.data.result) {
          this.$Message.success('更改成功，请重新登陆')
        }else{
          this.$Message.error('更改失败，请联系管理员')
        }
        this.$router.push('/login')
      }).catch(()=>{
        this.$Message.error('更改失败，请联系管理员')
        this.$router.push('/login')
      })
    },
    sendResetMail() {
      this.$axios
        .post("/api/auth/resetMail", { email: this.form.email })
        .then(res => {
          if (!res.data.result) {
            this.$Message.error("用户不存在");
            this.captchaObj.reset();
            this.loading = false;
            this.geetestSecondValidate = false;
          } else {
            this.loading = false;
            this.step++;
            clearInterval(this.resend.counter);
            this.resend.count = 120;
            this.resend.counter = setInterval(() => {
              this.resend.count--;
              if (this.resend.count == 1) {
                clearInterval(this.resend.counter);
                this.resend.counter = 0;
                this.resend.count = 120;
              }
            }, 1000);
          }
        })
        .catch(() => {
          this.$Message.error("用户不存在");
          this.captchaObj.reset();
          this.loading = false;
          this.geetestSecondValidate = false;
        });
    },
    geetestInitSuccsessHandler: function(captchaObj) {
      this.captchaObj = captchaObj;
      console.log(captchaObj);
      captchaObj.appendTo("#gt");
      captchaObj.onReady(() => {
        this.geetestReady = true;
      });
      captchaObj.onSuccess(async () => {
        const result = captchaObj.getValidate();
        this.geetestValidate = result;
        const res = await this.$axios.post(
          "/api/auth/geetest",
          this.geetestValidate
        );
        if (res.data.result === "success") {
          this.geetestSecondValidate = true;
        }
      });
    },
    async getGeetestCaptcha() {
      const req = await this.$axios.get(
        "/api/auth/geetest?t=" + new Date().getTime()
      );
      this.geetest = req.data;
      initGeetest(
        {
          gt: this.geetest.gt,
          challenge: this.geetest.challenge,
          new_captcha: this.geetest.new_captcha, // 用于宕机时表示是新验证码的宕机
          offline: !this.geetest.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
          product: "float", // 产品形式，包括：float，popup
          width: "100%"
        },
        this.geetestInitSuccsessHandler
      );
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
