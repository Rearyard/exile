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
              <Form ref="requestForm" :model="form" :rules="rules" id="login-form">
                <FormItem label="邮箱" prop="email">
                  <iInput v-model="form.email" size="large" @keypress.native="$event.key==='Enter'&&handleSubmit()"/>
                </FormItem>
                <FormItem label="请回答以下问题" prop="request">
                  <iInput type="textarea" v-model="form.request" :autosize="{minRows: 5,maxRows: 8}" size="large"
                          @keypress.native="$event.key==='Enter'&&handleSubmit()"/>
                </FormItem>
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
                  <Button type="success" :loading='loading' long @click="handleSubmit">提交申请</Button>
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
      captchaSrc:'/control/auth/captcha',
      loading: false,
      form: {
        email: "",
        request: "【说明】:请尽可能详尽的填写下列问题的回答，回答的越详尽真实越有可能通过申请。您也可以在回答完毕所有问题后加上自己想说的话。同时请不要删除题目以方便志愿者审核。\n\n(1)您想在后花园阅读/创作哪方面的同人？\n(2)您最喜欢的同人作品是哪一本？原因是什么？\n(3)请聊聊您最初是如何接触到了同人文化的\n",
        captcha: ""
      },
      rules: {
        email: [
          { required: true, message: "邮箱不可为空", trigger: "blur" },
          {type:"email",message:"请输入正确邮箱", trigger: "blur"}
        ],
        request: [{ required: true, message: "回答不可为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.captchaRefresh()
  },
  methods: {
    captchaRefresh() {
      this.captchaSrc='/control/auth/captcha?rand='+Math.random();
      /*(this.captcha = false),
        setTimeout(() => {
          this.captcha = true;
        }, 500);*/
    },
    captchaValidate() {
      return new Promise((resolve, reject) => {
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
            resolve(res.data.result);
          });
      });
    },
    postLogin() {
      return new Promise((resolve, reject) => {
        const csrfToken = cookie.get("csrfToken");
        this.$axios
          .post(
            "/control/user/invreq",
            { ...this.form },
            {
              headers: { "x-csrf-token": csrfToken },
              withCredentials: true
            }
          )
          .catch(err => {
            const errCode = err.response.status
            switch (errCode) {
              default:
                this.$Message.error("网络不畅或服务器故障");
                break;
            }
            this.captchaRefresh();
            this.loading = false;
            return false;
          })
          .then(res => {
            resolve(res.data);
          });
      });
    },
    async handleSubmit() {
      if (!this.form.captcha) {
        return this.$Message.error("请输入验证码");
      }
      this.$refs["requestForm"].validate(async valid => {
        if (valid) {
          this.loading= true;
          const result = await this.postLogin();
          if (result.code!=200) {
              this.$Notice.error({title:result.msg})
              this.captchaRefresh();
            this.loading = false;
          }else{
              this.$Notice.success({title:"提交成功，请耐心等待志愿者审核"})
              this.loading = false;
              this.$router.push('/login')
          }
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
