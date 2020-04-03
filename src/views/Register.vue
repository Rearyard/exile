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
          <Row v-if="step == 1">
            <iCol>
              <Form ref="registerForm" :model="form" :rules="rules" id="login-form">
                <FormItem label="用户名" prop="username">
                  <iInput v-model="form.username" placeholder="字母开头，8-21位，允许字母数字下划线" size="default"></iInput>
                </FormItem>
                <FormItem label="密码" prop="password">
                  <iInput
                    type="password"
                    password
                    placeholder="字母开头，8-21位，允许字母数字下划线"
                    v-model="form.password"
                    size="default"
                  ></iInput>
                </FormItem>
                <FormItem label="重复密码" prop="rePassword">
                  <iInput
                    type="password"
                    password
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
                <FormItem>
                  <Button type="success" long @click="basicInfoCheck">下一步</Button>
                </FormItem>
              </Form>
            </iCol>
          </Row>
          <Row v-if="step == 2">
            <iCol>
              <h2 style="text-align: center;margin:8px 0 8px 0">请填写你的生日</h2>
              <Row style="text-align: center;margin:18px 0 18px 0">
                <iCol span="12">
                  <DatePicker
                    type="date"
                    placeholder="请选择"
                    style="width: 200px"
                    v-model="form.birth"
                  ></DatePicker>
                </iCol>
                <iCol span="12">
                  <p style="text-align: center">{{ age }}岁</p>
                </iCol>
              </Row>
              <Row style="margin:18px 0 18px 0">
                <Collapse v-model="panel">
                  <Panel name="1">
                    您的年龄可以查看的分级
                    <div slot="content">
                      <ul>
                        <li
                          v-for="item in permissionRules[authority].rate_allow"
                          :key="item"
                        >{{ item }}:{{rateDescription[item]}}</li>
                      </ul>
                    </div>
                  </Panel>
                  <Panel name="2">
                    您的年龄不可以查看的分级
                    <div slot="content">
                      <ul>
                        <li
                          v-for="item in permissionRules[authority].rate_disallow"
                          :key="item"
                        >{{ item }}:{{rateDescription[item]}}</li>
                      </ul>
                    </div>
                  </Panel>
                  <Panel v-if="permissionRules[authority].provement" name="3">
                    确认这个分级所需要的自证
                    <div slot="content">
                      <p>{{permissionRules[authority].provement_item}}</p>
                      <Input
                        v-model="form.provement"
                        maxlength="800"
                        show-word-limit
                        type="textarea"
                        placeholder="建议您在本地编辑完成后再粘贴提交"
                        style="margin:18px 0 18px 0"
                      />
                    </div>
                  </Panel>
                </Collapse>
              </Row>
              <Checkbox style="margin:18px 0 18px 0" v-model="ageConfirm">我确定我填写了我的真实年龄，并认同此分级规定。</Checkbox>
              <Button
                :disabled="!ageConfirm"
                type="success"
                long
                @click="nextStep"
                v-if="step < 4"
              >下一步</Button>
            </iCol>
          </Row>
          <Row v-if="step == 3">
            <Spin size="large" fix v-if="cardLoading">
              <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
              提交中......</Spin>
            <iCol>
              <h2 style="text-align: center;margin:8px 0 8px 0">用户协议</h2>
              <Scroll
                :on-reach-bottom="handleReachBottom"
                :distance-to-edge="0"
                loading-text="感谢你阅读完毕，可以继续"
                style="border: 1px solid gainsboro;border-radius: 4px;padding: 8px;;margin:8px 0 8px 0"
              >
                <p>{{userAgreement}}</p>
              </Scroll>
              <Checkbox
                :disabled="!userAgreementRead"
                v-model="userAgreementAgreed" 
              >我已经阅读并接受《后花园用户协议》</Checkbox>
            </iCol>
            <Button long type="success" :disabled="!userAgreementAgreed" @click="handleSubmit">提交</Button>
          </Row>
          <Row v-if="step == 4">
            <h2 style="text-align: center;margin:8px 0 8px 0">注册完成</h2>
            <p style="text-align: center;margin:18px 0 18px 0">
              如果您不需要验证自证材料，马上就可以开始体验后花园啦！
              <br />为了验证您的邮箱有效，您稍后会进入激活账号流程
              <br />如果您提交了自证材料，还请耐心等待我们的管理人员审核。
              <br />审核结束之前，只要激活账户您依然可以阅读非限制级内容，感谢您的谅解。
            </p>
            <Button type="success" long @click="jumpLogin">确定</Button>
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
      if (value != this.form.password) {
        return callback(new Error("前后密码输入不一致"));
      }
      return callback();
    };
    return {
      icon: require("@/assets/favicon_green.png"),
      step: 1,
      panel: "2",
      ageConfirm: false,
      loading: true,
      cardLoading:false,
      form: {
        username: "",
        password: "",
        rePassword: "",
        email: "",
        invCode: "",
        birth: "2020-04-01",
        provement: ""
      },
      userAgreement:"",
      userAgreementRead: false,
      userAgreementAgreed: false,
      rules: {
        username: [
          { required: true, message: "用户名不可为空", trigger: "blur" },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{7,20}$/,
            message: "用户名不合规",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" },
          {
            pattern: /^[a-zA-Z]\w{7,20}$/,
            message: "密码不合规",
            trigger: "change"
          }
        ],
        rePassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: validateRe, trigger: "change" },
          { validator: validateRe, trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不可为空", trigger: "blur" },
          { type: "email", message: "请填写正确邮箱", trigger: "change" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        invCode: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      },
      permissionRules: [],
      rateDescription: {}
    };
  },
  computed: {
    age() {
      const birthday = moment(this.form.birth);
      return Math.abs(moment.duration(moment().diff(birthday)).years());
    },
    authority() {
      for (const key in this.permissionRules) {
          const element = this.permissionRules[key];
          if (element.min_age<=this.age&&this.age<=element.max_age) {
            return Number(key);
        }
      }
      return 0;
    }
  },
  mounted() {
    this.getInfo();
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
    jumpLogin(){
      this.$router.push('/login')
    },
    getInfo(){
      this.$axios.get('/api/auth/register/info').then((res)=>{
        for (const key in res.data) {
            const element = res.data[key];
            this[key] = element
        }
      })
    },
    nextStep() {
      this.step++;
    },
    basicInfoCheck() {
      this.$refs['registerForm'].validate(valid => {
        if (valid) {
          this.nextStep()
        } else {
          return;
        }
      });
    },
    handleReachBottom() {
      this.userAgreementRead = true;
    },
    handleSubmit(){
      const csrfToken = cookie.get("csrfToken");
      this.cardLoading = true;
      this.$axios
      .post(
        "/api/auth/register",
        { ...this.form },
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res=>{
        console.log(res)
        this.cardLoading = false;
        this.step++;
      })
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
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>
