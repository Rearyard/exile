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
        </Row>
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
        <Row class="wrapper-card"></Row>
      </iCol>
    </Row>
  </div>
</template>

<script>
export default {};
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
</style>