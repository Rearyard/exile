<template>
  <Row>
    <iCol span="20" offset="2">
      <Row class="wrapper-card" type="flex" justify="space-around" align="middle">
        <div class="card-content">
          <Row type="flex" justify="center">
            <iCol span="8">
              <img class="theme-icon" src="../assets/icons/need.svg" />
            </iCol>
            <iCol span="16">
              <p class="card-content-title">这里需要你</p>
            </iCol>
          </Row>
          <div class="card-content-text">
            <p>很高兴认识您！这里是后花园开发组，我们是一群来自五湖四海的学生，志愿开发了这个平台。</p>
            <p>目前平台所有的费用都有开发者承担，我们暂时不需要捐赠，您的创作热情就是对我们最大的鼓励。</p>
            <p>我们希望有更多懂得相关技术以及平台运营的人参与进来（事实上因为人手不足，我打下这行字的时候已经通宵了两天），我们也希望能找到更多志同道合的朋友，共同建设我们的后花园。</p>
            <p>衷心希望您能在这里获得快乐！</p>
            <p style="text-align: right;">——后花园全体开发组</p>
          </div>
        </div>
      </Row>
      <Row class="wrapper-card">
        <Row type="flex" justify="center">
          <iCol span="8">
            <img class="theme-icon" src="../assets/icons/staff.svg" />
          </iCol>
          <iCol span="16">
            <p class="card-content-title">我们需要...</p>
          </iCol>
        </Row>
        <Row type="flex" :gutter="16" justify="space-between">
          <iCol span="12" class="staff-card-item">
            <img src="../assets/icons/frontend.svg" />
            <p class="staff-card-item-title">前端开发志愿者</p>
            <p class="staff-card-item-text">前端使用Vue框架进行开发，短期之内不会变更，我们需要对Vue以及Axios有一定了解的志愿者。</p>
          </iCol>
          <iCol span="12" class="staff-card-item">
            <img src="../assets/icons/backend.svg" />
            <p class="staff-card-item-title">后端开发志愿者</p>
            <p class="staff-card-item-text">后端使用基于Node的Egg框架(继承于koa框架)，我们需要对Node以及mysql有一定了解的志愿者。</p>
          </iCol>
        </Row>
        <Row type="flex" :gutter="16" justify="space-between">
          <iCol span="12" class="staff-card-item">
            <img src="../assets/icons/server.svg" />
            <p class="staff-card-item-title">运维志愿者</p>
            <p class="staff-card-item-text">项目部署在CentOS服务器上，使用Nginx进行反向代理，未来可能进行多服务器部署，我们需要对数据库运维以及服务器拥塞控制有一定了解的志愿者。</p>
          </iCol>
          <iCol span="12" class="staff-card-item">
            <img src="../assets/icons/volunteer.svg" />
            <p class="staff-card-item-title">其他志愿者</p>
            <p class="staff-card-item-text">平台在将来或许还需要结合相关法律一同制定更合理的社区规则，也需要处理用户的抄袭检举/反馈。我们需要懂得法律，或者单纯愿意付出时间的志愿者。</p>
          </iCol>
        </Row>
      </Row>
      <Row class="wrapper-card">
        <Row type="flex" justify="center">
          <iCol span="8">
            <img class="theme-icon" src="../assets/icons/heart.svg" />
          </iCol>
          <iCol span="16">
            <p class="card-content-title">最重要的是...</p>
          </iCol>
        </Row>
        <Row>
          <div class="card-content-text">
            <p>希望您有一颗热爱创作的心。</p>
            <p>平台从开发到问世，全部的动力都来源于对创作的热爱。由于项目不可能进行商业化，因而要求运行人员必须有持之以恒的热爱，能将这份付出坚持下去。</p>
            <p>我们也欢迎有学习意向的学生加入，项目的全部代码都发布在Github上，也欢迎你来提出自己的建议。</p>
          </div>
        </Row>
      </Row>
      <Row class="wrapper-card">
        <Row>
          <iCol span="6">
            <img class="theme-icon" src="../assets/icons/info.svg" />
          </iCol>
          <iCol span="16">
            <div class="card-content">
              <p class="card-content-title" style="margin:0;">如有意向请留言：</p>
            </div>
          </iCol>
        </Row>
        <Row :gutter="16" style="padding-top: 1rem;">
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
      </Row>
    </iCol>
  </Row>
</template>

<script>
export default {
  data(){
    return{
      message: '',
      email: '',
      name: ''
    }
  }
}
</script>
<style scoped>
.wrapper-card {
  margin: 15px 0 15px 0;
  padding: 2rem 1rem 1.5rem 1.3rem;
  border: 1px solid rgb(226, 226, 226);
  background-color: #ffffff;
  box-shadow: 0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
.theme-icon {
  width: 2rem;
  float: right;
}
.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-content-title {
  margin: auto 0 1em 0;
  text-align: left;
  font-weight: bold;
  font-size: 1.5em;
}
.card-content-text {
  margin: 0 0 auto 0;
  text-indent: 1rem;
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
  text-align: left;
}
</style>


