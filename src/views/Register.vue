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
                    <iInput v-model="form.invCode" size="default"></iInput>
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
                    <Button type="success" long @click="handleSubmit">注册</Button>
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
export default {
  data(){
    return{
      icon:require('@/assets/favicon_green.png'),
      loading: true,
      form: {
        username: "",
        password: "",
        rePassword: "",
        email: "",
        captcha: "",
        invCode:""
      },
    }
  }
}
</script>

<style>
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