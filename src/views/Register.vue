<template>
  <div>
    <Row type="flex" justify="center" align="middle" id="mainCard">
      <iCol :xs="20" :lg="8">
        <Card>
          <Row type="flex" justify="center" align="middle">
            <iCol>
              <Avatar :src="icon" size="90" id="icon" />
            </iCol>
          </Row>
          <!-- 基础信息 -->
          <Row v-if='step == 1'>
            <iCol>
              <Form ref="loginForm" :model="form" :rules="rules" id="login-form">
                <FormItem label="用户名" prop="username">
                  <iInput v-model="form.username" placeholder="字母开头，8-21位，允许字母数字下划线" size="default"></iInput>
                </FormItem>
                <FormItem label="密码" prop="password">
                  <iInput
                    type="password"
                    placeholder="字母开头，8-21位，允许字母数字下划线"
                    v-model="form.password"
                    size="default"
                  ></iInput>
                </FormItem>
                <FormItem label="重复密码" prop="re_password">
                  <iInput
                    type="password"
                    placeholder="确认密码输入无误"
                    v-model="form.rePassword"
                    size="default"
                  ></iInput>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                  <iInput v-model="form.email" size="default"></iInput>
                </FormItem>
                <FormItem label="邀请码" prop="invCode">
                  <iInput disabled v-model="form.invCode" size="default"></iInput>
                </FormItem>
                <FormItem v-if="captchaType=='pic'" label="验证码">
                  <Row type="flex" align="middle" style="width:100%">
                    <iCol span="24">
                      <iInput v-model="form.captcha" placeholder="验证码"></iInput>
                    </iCol>
                    <img src="/api/auth/captcha" id="captcha" />
                  </Row>
                </FormItem>
                <FormItem>
                  <Button type="success" long @click="nextStep" v-if="step<4">下一步</Button>
                </FormItem>
              </Form>
            </iCol>
          </Row>
          <Row v-if='step==2'>
            <iCol style='text-align:center'>
              <h2>选择你的年龄</h2>
              <DatePicker type="date" placeholder="Select date" style="width: 200px"></DatePicker>
            </iCol>
          </Row>
        </Card>
      </iCol>
    </Row>
  </div>
</template>

<script>
import cookie from "js-cookie";
import moment from "moment";

export default {
  data() {
    const validateRe = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("需要重复输入密码"));
      }
      if (this.rePassword != this.password) {
        return callback(new Error("前后密码输入不一致"));
      }
      callback();
    };
    return {
      icon: require("@/assets/favicon_green.png"),
      step:1,
      loading: true,
      form: {
        username: "",
        password: "",
        rePassword: "",
        email: "",
        invCode: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不可为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" }
        ],
        rePassword: [{ validator: validateRe, trigger: "blur" }],
        email: [
          { required: true, message: "邮箱不可为空", trigger: "blur" },
          { type: "email", message: "请填写正确邮箱", trigger: "change" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        invCode: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    const csrfToken = cookie.get("csrfToken");
    if (!this.$route.query.code) {
      this.$Modal.warning({
        title: "不可注册",
        content: "对不起，本站目前仅接受邀请链接来源的注册。"
      });
      return this.$router.push("/");
    }
    this.form.invCode = this.$route.query.code;
    this.$axios
      .post(
        "/api/auth/invcode",
        { code: this.form.invCode },
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      )
      .then(res => {
        if (res.data.remain <= 0) {
          this.$Modal.warning({
            title: "不可注册",
            content: "对不起，您的注册链接或注册码剩余使用次数不足。",
            onOk: () => {
              this.$router.push("/");
            }
          });
        }
        if (moment(res.data.expire) < moment()) {
          this.$Modal.warning({
            title: "不可注册",
            content: "对不起，您的注册链接或注册码已过期",
            onOk: () => {
              this.$router.push("/");
            }
          });
        }
      });
  },
  methods: {
    nextStep(){
      this.step++;
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
  margin-top: 10vh;
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
  position: absolute;
  right: 0;
  border: 1px solid #dcdee2;
  border-radius: 3px;
}
</style>