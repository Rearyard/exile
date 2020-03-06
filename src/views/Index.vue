<template>
  <div>
    <Row type="flex" justify="center">
      <iCol span="20">
        <Row type="flex" justify="space-between">
          <iCol span="17" class="wrapper-card">
            <div class="title-topic">
              <p>热门同人</p>
            </div>
          </iCol>
          <iCol span="6" class="wrapper-card">
            <p class="title-sub">标签墙</p>
          </iCol>
        </Row>
        <Row type="flex" justify="space-between">
          <iCol span="17" class="wrapper-card">
            <div class="title-topic">
              <p>热门大大</p>
            </div>
          </iCol>
          <iCol span="6" class="wrapper-card">
            <p class="title-sub">人气推荐</p>
          </iCol>
        </Row>
        <Row type="flex" justify="space-between">
          <iCol span="24" class="wrapper-card">
            <div class="title-topic">
              <p>热门专题</p>
            </div>
          </iCol>
        </Row>
        <Row type="flex" justify="space-between">
          <iCol span="24" class="wrapper-card">
            <div class="title-topic">
              <p>热门圈子</p>
            </div>
          </iCol>
        </Row>
      </iCol>
    </Row>
  </div>
</template>

<script>
export default {};
</script>

<style>
.wrapper-card {
  margin:15px 0 15px 0;
  padding:15px;
  border:1px solid rgb(226, 226, 226);
  background-color: #ffffff;
  box-shadow: 0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
</style>