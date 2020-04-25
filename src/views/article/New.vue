<template>
  <div>
    <Row style="margin-top:2rem">
      <i-col
        :xs="{ span: 20, offset: 2}"
        :sm="{ span: 18, offset:3 }"
        :md="{ span: 16, offset: 4 }"
        :lg="{ span: 14, offset: 5 }"
      >
        <Breadcrumb separator=" > " style="margin-bottom: 2rem">
          <Breadcrumb-item href="/">
            <Icon type="ios-home-outline"></Icon>后花园
          </Breadcrumb-item>
          <Breadcrumb-item href="/components/breadcrumb">
            <Icon type="social-buffer-outline"></Icon>文区
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="pound"></Icon>新文章
          </Breadcrumb-item>
        </Breadcrumb>
        <div class="wrap-card" @click="jump('/article/edit')">
          <span>> 创建新的小说</span>
        </div>
        <div class="wrap-card" @click="jump('/article/draft')">
          <span>> 草稿箱</span>
        </div>
        <div class="wrap-card" @click="jump('/article/import')">
          <span>>从Lofter的XML导入</span>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  methods: {
    jump(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style scoped>
.wrap-card {
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
    0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.wrap-card span {
  display: table-cell;
  padding-left: 1rem;
  vertical-align: middle;
  font-size: 1.2rem;
  height: 30px;
  color: rgba(95, 95, 95, 0.7);
  text-shadow: 0px 1px 1px rgba(71, 68, 66, 0.6);
  font-family: "Arvo", "Myriad Pro", "Trebuchet MS", sans-serif;
}
.wrap-card:hover {
  /* background: rgba(170, 77, 27, 0.6); */
  transform: scale(1.02);
  box-shadow: 0px -1px 5px 4px rgba(224, 230, 228, 0.65) inset,
    0px 3px 2px 2px rgba(208, 208, 208, 0.8);
}
</style>