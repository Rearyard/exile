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
                  <iInput v-model="form.username" size="large"></iInput>
                </FormItem>
                <FormItem label="密码" prop="password">
                  <iInput type="password" v-model="form.password" size="large"></iInput>
                </FormItem>
                <Row>
                  <iCol :xs="5" :lg="4" offset="20">
                    <router-link to="/reset">忘记密码</router-link>
                  </iCol>
                </Row>
                <FormItem label="验证码">
                  <Row type="flex" align="middle" style="width:100%">
                    <iCol span="24">
                      <iInput v-model="form.captcha" size="large"></iInput>
                    </iCol>
                    <img src="/api/auth/captcha" id="captcha" />
                  </Row>
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
export default {
  data(){
    return{
      icon:require('@/assets/favicon_green.png'),
      loading:true,
      form: {
        username: "",
        password: "",
        captcha: ""
      }
    }
  }
};
</script>

<style>
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
  position: absolute;
  right: 0;
  border: 1px solid #dcdee2;
  border-radius: 3px;
}
</style>