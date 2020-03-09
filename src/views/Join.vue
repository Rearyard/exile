<template>
  <div>
    <Row type="flex" justify="center">
      <iCol span="14">
        <Row class="wrapper-card" type="flex" justify="space-around" align="middle">
          <iCol span="6">
            <img class="theme-icon" src="../assets/icons/need.svg" />
          </iCol>
          <iCol span="16">
            <div class="card-content">
              <p class="card-content-title">这里需要你</p>
              <p class="card-content-text">
                文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案
                文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案
              </p>
            </div>
          </iCol>
        </Row>
        <Row class="wrapper-card">
          <Row type="flex" justify="center" style="height: 60px;">
            <iCol style="height:100%;">
              <img src="../assets/icons/staff.svg" style="height:100%;" />
            </iCol>
            <iCol style="display:flex;height:100%;">
              <p style="margin: auto;font-size: 1.5em;font-weight: bold;">我们需要...</p>
            </iCol>
          </Row>
          <Row type="flex" justify="space-between">
            <iCol span="4" class="staff-card-item">
              <img src="../assets/icons/frontend.svg" />
              <p class="staff-card-item-title">前端开发志愿者</p>
              <p class="staff-card-item-text">文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案</p>
            </iCol>
            <iCol span="4" class="staff-card-item">
              <img src="../assets/icons/backend.svg" />
              <p class="staff-card-item-title">后端开发志愿者</p>
              <p class="staff-card-item-text">文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案</p>
            </iCol>
            <iCol span="4" class="staff-card-item">
              <img src="../assets/icons/server.svg" />
              <p class="staff-card-item-title">运维志愿者</p>
              <p class="staff-card-item-text">文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案</p>
            </iCol>
            <iCol span="4" class="staff-card-item">
              <img src="../assets/icons/volunteer.svg" />
              <p class="staff-card-item-title">其他志愿者</p>
              <p class="staff-card-item-text">文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案</p>
            </iCol>
          </Row>
        </Row>
        <Row class="wrapper-card" type="flex" justify="space-around" align="middle">
          <iCol span="6">
            <img class="theme-icon" src="../assets/icons/heart.svg" />
          </iCol>
          <iCol span="16">
            <div class="card-content">
              <p class="card-content-title">最重要的是……</p>
              <p class="card-content-text">
                文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案
                文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案
              </p>
            </div>
          </iCol>
        </Row>
        <Row class="wrapper-card" type="flex" justify="space-around" align="middle">
          <iCol span="6">
            <img class="theme-icon" src="../assets/icons/info.svg" />
          </iCol>
          <iCol span="16">
            <div class="card-content">
              <p class="card-content-title" style="margin:0;">如有意向请留言：</p>
              <p style="color:gray;margin-bottom: 1em;">或发邮件到xxxxxxx表明来意</p>
              <Row :gutter="16">
                <iCol span="12">
                  <iInput v-model="name" placeholder="称呼"></iInput>
                </iCol>
                <iCol span="12">
                  <iInput v-model="email" placeholder="邮箱"></iInput>
                </iCol>
              </Row>
              <Row style="margin-top:5px;">
                <iCol span="24">
                  <iInput type="textarea" v-model="message" placeholder="留言" :rows="6"></iInput>
                </iCol>
              </Row>
            </div>
          </iCol>
        </Row>
      </iCol>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      name: ""
    };
  }
};
</script>

<style scoped>
.wrapper-card {
  margin: 15px 0 15px 0;
  padding: 15px 30px 15px 30px;
  border: 1px solid rgb(226, 226, 226);
  background-color: #ffffff;
  box-shadow: 0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
.theme-icon {
  width: 100%;
}
.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-content-title {
  margin: auto 0 1em 0;
  font-weight: bold;
  font-size: 1.5em;
}
.card-content-text {
  margin: 0 0 auto 0;
}
.staff-card-item{
  margin: 0 0 18px 0;
}
.staff-card-item img {
  width: 100%;
}
.staff-card-item-title {
  margin: 0 0 5px 0;
  text-align: center;
  font-weight: bold;
}
.staff-card-item-text {
  text-align: center;
}
</style>