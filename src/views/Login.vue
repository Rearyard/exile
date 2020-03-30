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
            <iCol>
              <Form ref="loginForm" :model="form" :rules="rules" id="login-form">
                <FormItem label="用户名" prop="username">
                  <iInput v-model="form.username" size="large" @keypress.native="$event.key==='Enter'&&handleSubmit()"/>
                </FormItem>
                <FormItem label="密码" prop="password">
                  <iInput type="password" v-model="form.password" size="large"
                          @keypress.native="$event.key==='Enter'&&handleSubmit()"/>
                </FormItem>
                <Row style="display:flex;justify-content:end">
                    <router-link to="/reset">忘记密码</router-link>
                </Row>
                <FormItem label="验证码">
                  <div type="flex"
                       style="width:100%;display: flex;align-items: center">
                    <div style="flex:3 1 0">
                      <iInput v-model="form.captcha" size="large" @keypress.native="$event.key==='Enter'&&handleSubmit()"/>
                    </div>
                      <img
                        style="flex: 1 1 0"
                        v-if="captcha"
                        :src="captchaSrc"
                        id="captcha"
                        @click="captchaRefresh"
                      />
                  </div>
                </FormItem>
                <FormItem>
                  <Button type="success" long @click="handleSubmit">登录</Button>
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

export default {
  data() {
    return {
      icon: require("@/assets/favicon_green.png"),
      captcha: true,
      captchaSrc:'/api/auth/captcha',
      loading: true,
      form: {
        username: "",
        password: "",
        captcha: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不可为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.captchaRefresh()
  },
  methods: {
    captchaRefresh() {
      this.captchaSrc='/api/auth/captcha?rand='+Math.random();
      /*(this.captcha = false),
        setTimeout(() => {
          this.captcha = true;
        }, 500);*/
    },
    captchaValidate() {
      return new Promise((resove, reject) => {
        const csrfToken = cookie.get("csrfToken");
        this.$axios
          .post(
            "/api/auth/captcha",
            { captcha: this.form.captcha },
            {
              headers: { "x-csrf-token": csrfToken },
              withCredentials: true
            }
          )
          .then(res => {
            resove(res.data.result);
          });
      });
    },
    postLogin() {
      return new Promise((resove, reject) => {
        const csrfToken = cookie.get("csrfToken");
        this.$axios
          .post(
            "/api/auth/login",
            { ...this.form },
            {
              headers: { "x-csrf-token": csrfToken },
              withCredentials: true
            }
          )
          .catch(err => {
            this.$Message.error("用户名或密码错误，请检查");
            return false;
          })
          .then(res => {
            resove(res);
          });
      });
    },
    async handleSubmit() {
      if (!this.form.captcha) {
        return this.$Message.error("请输入验证码");
      }
      const captcha = await this.captchaValidate();
      console.log(captcha);
      if (!captcha) {
        this.captchaRefresh();
        return this.$Message.error("验证码错误，请重新输入");
      }
      this.$refs["loginForm"].validate(async valid => {
        if (valid) {
          const user = await this.postLogin();
          if (!user) {
            return;
          }
          if (user.data.user_canceled) {
            return this.$Message.error("用户已被注销");
          }
          this.$store.commit("setUserInfo", user.data);
          this.$Message.success(
            `欢迎回来，${this.$store.state.user.user_nickname}`
          );
          if (this.$route.query.from) {
            return this.$router.push(this.$route.query.from)
          }
          return this.$router.push('/')
        }
      });
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
